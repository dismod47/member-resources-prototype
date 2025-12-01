import { sql } from '../db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Check if DATABASE_URL is configured
      if (!process.env.DATABASE_URL) {
        return res.status(500).json({ 
          error: 'Database not configured', 
          details: 'DATABASE_URL environment variable is not set. Please configure it in Vercel settings.' 
        });
      }

      // Validate DATABASE_URL format
      const dbUrl = process.env.DATABASE_URL.trim();
      if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
        return res.status(500).json({
          error: 'Invalid DATABASE_URL format',
          details: `DATABASE_URL should start with 'postgresql://' but starts with: ${dbUrl.substring(0, 30)}...`,
          fix: 'Copy the full connection string from Neon dashboard (Connection Details tab)',
          currentValue: dbUrl.substring(0, 20) + '...' // Don't expose full URL for security
        });
      }

      // Get all posts with their comment counts
      // Handle case where tables might not exist yet
      let posts;
      try {
        posts = await sql`
          SELECT 
            p.id,
            p.title,
            p.description,
            p.timestamp,
            p.is_demo,
            COALESCE(json_agg(
              json_build_object(
                'id', c.id,
                'text', c.text,
                'timestamp', c.timestamp
              ) ORDER BY c.timestamp ASC
            ) FILTER (WHERE c.id IS NOT NULL), '[]') as comments
          FROM posts p
          LEFT JOIN comments c ON p.id = c.post_id
          GROUP BY p.id, p.title, p.description, p.timestamp, p.is_demo
          ORDER BY p.timestamp DESC
        `;
      } catch (tableError) {
        if (tableError.message?.includes('does not exist') || tableError.message?.includes('relation')) {
          return res.status(500).json({
            error: 'Database tables not found',
            details: 'The posts or comments tables do not exist.',
            fix: 'Run the schema.sql script in Neon SQL Editor to create the required tables.',
            sqlError: tableError.message
          });
        }
        throw tableError; // Re-throw if it's a different error
      }

      // Helper function to convert timestamp to ISO string
      const toISOString = (timestamp) => {
        if (!timestamp) return new Date().toISOString();
        if (timestamp instanceof Date) return timestamp.toISOString();
        if (typeof timestamp === 'string') {
          // If it's already an ISO string, return as is
          if (timestamp.includes('T') && timestamp.includes('Z')) return timestamp;
          // Otherwise try to parse it
          const date = new Date(timestamp);
          return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
        }
        return new Date().toISOString();
      };

      // Transform the data to match the frontend format
      const transformedPosts = (posts || []).map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        timestamp: toISOString(post.timestamp),
        isDemo: post.is_demo || false,
        comments: Array.isArray(post.comments) ? post.comments.map(comment => ({
          id: comment.id,
          text: comment.text,
          timestamp: toISOString(comment.timestamp)
        })) : []
      }));

      res.status(200).json(transformedPosts);
    } 
    else if (req.method === 'POST') {
      // Create a new post
      const { title, description } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const [newPost] = await sql`
        INSERT INTO posts (title, description)
        VALUES (${title.trim()}, ${description || ''})
        RETURNING id, title, description, timestamp
      `;

      // Helper to convert timestamp
      const toISO = (ts) => ts instanceof Date ? ts.toISOString() : (typeof ts === 'string' ? ts : new Date(ts).toISOString());
      
      res.status(201).json({
        id: newPost.id,
        title: newPost.title,
        description: newPost.description,
        timestamp: toISO(newPost.timestamp),
        isDemo: false,
        comments: []
      });
    }
    else if (req.method === 'PUT') {
      // Update an existing post
      const { id, title, description } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      // Check if post exists and is not a demo post
      const [existingPost] = await sql`
        SELECT id, is_demo FROM posts WHERE id = ${id}
      `;

      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (existingPost.is_demo) {
        return res.status(403).json({ error: 'Demo posts cannot be edited' });
      }

      const [updatedPost] = await sql`
        UPDATE posts
        SET title = ${title || ''}, description = ${description || ''}
        WHERE id = ${id}
        RETURNING id, title, description, timestamp, is_demo
      `;

      // Get comments for this post
      const comments = await sql`
        SELECT id, text, timestamp
        FROM comments
        WHERE post_id = ${id}
        ORDER BY timestamp ASC
      `;

      // Helper to convert timestamp
      const toISO = (ts) => ts instanceof Date ? ts.toISOString() : (typeof ts === 'string' ? ts : new Date(ts).toISOString());
      
      res.status(200).json({
        id: updatedPost.id,
        title: updatedPost.title,
        description: updatedPost.description,
        timestamp: toISO(updatedPost.timestamp),
        isDemo: updatedPost.is_demo || false,
        comments: comments.map(c => ({
          id: c.id,
          text: c.text,
          timestamp: toISO(c.timestamp)
        }))
      });
    }
    else if (req.method === 'DELETE') {
      // Delete a post (comments will be cascade deleted)
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      // First check if post exists and is not a demo post
      const [existingPost] = await sql`
        SELECT id, is_demo FROM posts WHERE id = ${id}
      `;

      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (existingPost.is_demo) {
        return res.status(403).json({ error: 'Demo posts cannot be deleted' });
      }

      await sql`
        DELETE FROM posts WHERE id = ${id}
      `;

      res.status(200).json({ message: 'Post deleted successfully' });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    // Return detailed error for debugging
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message || 'Unknown error',
      type: error.constructor.name,
      hint: error.message?.includes('does not exist') 
        ? 'Tables may not exist. Run schema.sql in Neon SQL Editor to create them.'
        : error.message?.includes('connection')
        ? 'Database connection failed. Check DATABASE_URL format in Vercel settings.'
        : 'Check Vercel function logs for more details.'
    });
  }
}

