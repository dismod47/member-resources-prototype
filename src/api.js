// API utility functions for communicating with the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Get all posts
export const getPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

// Create a new post
export const createPost = async (title, description) => {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create post');
  }
  return response.json();
};

// Update a post
export const updatePost = async (id, title, description) => {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, title, description }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update post');
  }
  return response.json();
};

// Delete a post
export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/posts?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete post');
  }
  return response.json();
};

// Add a comment
export const addComment = async (postId, text) => {
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId, text }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add comment');
  }
  return response.json();
};

// Update a comment
export const updateComment = async (id, text) => {
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, text }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update comment');
  }
  return response.json();
};

// Delete a comment
export const deleteComment = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/comments?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete comment');
  }
  return response.json();
};

