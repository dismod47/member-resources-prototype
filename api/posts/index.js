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

      // Get all posts with their comment counts
      const posts = await sql`
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

      // Transform the data to match the frontend format
      const transformedPosts = (posts || []).map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        timestamp: post.timestamp ? post.timestamp.toISOString() : new Date().toISOString(),
        isDemo: post.is_demo || false,
        comments: Array.isArray(post.comments) ? post.comments.map(comment => ({
          id: comment.id,
          text: comment.text,
          timestamp: comment.timestamp ? comment.timestamp.toISOString() : new Date().toISOString()
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

      res.status(201).json({
        id: newPost.id,
        title: newPost.title,
        description: newPost.description,
        timestamp: newPost.timestamp.toISOString(),
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

      res.status(200).json({
        id: updatedPost.id,
        title: updatedPost.title,
        description: updatedPost.description,
        timestamp: updatedPost.timestamp.toISOString(),
        isDemo: updatedPost.is_demo || false,
        comments: comments.map(c => ({
          id: c.id,
          text: c.text,
          timestamp: c.timestamp.toISOString()
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
    // Return more detailed error in development, generic in production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error';
    res.status(500).json({ 
      error: 'Internal server error', 
      details: errorMessage,
      type: error.constructor.name
    });
  }
}

