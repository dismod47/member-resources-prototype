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
    if (req.method === 'POST') {
      // Add a new comment
      const { postId, text } = req.body;

      if (!postId || !text || !text.trim()) {
        return res.status(400).json({ error: 'Post ID and comment text are required' });
      }

      const [newComment] = await sql`
        INSERT INTO comments (post_id, text)
        VALUES (${postId}, ${text.trim()})
        RETURNING id, post_id, text, timestamp
      `;

      res.status(201).json({
        id: newComment.id,
        postId: newComment.post_id,
        text: newComment.text,
        timestamp: newComment.timestamp.toISOString()
      });
    }
    else if (req.method === 'PUT') {
      // Update a comment
      const { id, text } = req.body;

      if (!id || !text || !text.trim()) {
        return res.status(400).json({ error: 'Comment ID and text are required' });
      }

      const [updatedComment] = await sql`
        UPDATE comments
        SET text = ${text.trim()}
        WHERE id = ${id}
        RETURNING id, post_id, text, timestamp
      `;

      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.status(200).json({
        id: updatedComment.id,
        postId: updatedComment.post_id,
        text: updatedComment.text,
        timestamp: updatedComment.timestamp.toISOString()
      });
    }
    else if (req.method === 'DELETE') {
      // Delete a comment
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Comment ID is required' });
      }

      // First check if comment exists
      const [existingComment] = await sql`
        SELECT id FROM comments WHERE id = ${id}
      `;

      if (!existingComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      await sql`
        DELETE FROM comments WHERE id = ${id}
      `;

      res.status(200).json({ message: 'Comment deleted successfully' });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

