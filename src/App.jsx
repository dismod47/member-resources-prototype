import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Edit2, Trash2, X, Calendar, GraduationCap, Users, FileText, Code, Briefcase, UserCheck, Shield, User } from 'lucide-react';

const MemberResourcesApp = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', description: '' });
  const [newComment, setNewComment] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  // Load posts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('memberResourcesPosts');
    if (saved) {
      setPosts(JSON.parse(saved));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('memberResourcesPosts', JSON.stringify(posts));
  }, [posts]);

  const createPost = () => {
    if (!newPost.title.trim()) return;
    
    const post = {
      id: Date.now(),
      title: newPost.title,
      description: newPost.description,
      timestamp: new Date().toISOString(),
      comments: []
    };
    
    setPosts([post, ...posts]);
    setNewPost({ title: '', description: '' });
    setShowNewPost(false);
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    setSelectedPost(null);
  };

  const updatePost = (postId, updates) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, ...updates } : p));
    setEditingPost(null);
  };

  const addComment = (postId) => {
    if (!newComment.trim()) return;
    
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, {
            id: Date.now(),
            text: newComment,
            timestamp: new Date().toISOString()
          }]
        };
      }
      return p;
    }));
    
    setNewComment('');
    
    // Update selected post if viewing
    if (selectedPost && selectedPost.id === postId) {
      const updated = posts.find(p => p.id === postId);
      setSelectedPost({
        ...updated,
        comments: [...updated.comments, {
          id: Date.now(),
          text: newComment,
          timestamp: new Date().toISOString()
        }]
      });
    }
  };

  const deleteComment = (postId, commentId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.filter(c => c.id !== commentId)
        };
      }
      return p;
    }));
    
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: selectedPost.comments.filter(c => c.id !== commentId)
      });
    }
  };

  const updateComment = (postId, commentId, newText) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => c.id === commentId ? { ...c, text: newText } : c)
        };
      }
      return p;
    }));
    
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: selectedPost.comments.map(c => c.id === commentId ? { ...c, text: newText } : c)
      });
    }
    
    setEditingComment(null);
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(query);
    const descMatch = post.description.toLowerCase().includes(query);
    const commentMatch = post.comments.some(c => c.text.toLowerCase().includes(query));
    
    return titleMatch || descMatch || commentMatch;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-64 flex flex-col" style={{ backgroundColor: '#303C4E' }}>
        <div className="p-6 text-xl font-bold border-b" style={{ color: '#EBF2FC', borderColor: 'rgba(235, 242, 252, 0.2)' }}>
          Scholarship Prototype
        </div>
        
        <nav className="flex-1 flex flex-col">
          <button
            disabled
            className="px-6 py-4 text-center transition opacity-60 cursor-not-allowed font-bold rounded-lg mx-4 mt-4"
            style={{ color: '#EBF2FC', backgroundColor: '#293343' }}
          >
            Hello, Member!
          </button>
          <button
            disabled
            className="px-6 py-4 text-left transition opacity-60 cursor-not-allowed font-bold flex items-center gap-3"
            style={{ color: '#EBF2FC' }}
          >
            <Calendar size={20} />
            Events
          </button>
          <button
            disabled
            className="px-6 py-4 text-left transition opacity-60 cursor-not-allowed font-bold flex items-center gap-3"
            style={{ color: '#EBF2FC' }}
          >
            <GraduationCap size={20} />
            Education
          </button>
          <button
            disabled
            className="px-6 py-4 text-left transition opacity-60 cursor-not-allowed font-bold flex items-center gap-3"
            style={{ color: '#EBF2FC' }}
          >
            <Users size={20} />
            Get Involved
          </button>
          <button
            onClick={() => {
              setActiveTab('resources');
              setSelectedPost(null);
            }}
            className={`px-6 py-4 text-left transition font-bold flex items-center gap-3 ${
              activeTab === 'resources' ? '' : 'opacity-80 hover:opacity-100'
            }`}
            style={{ 
              color: activeTab === 'resources' ? '#337B72' : '#EBF2FC',
              backgroundColor: activeTab === 'resources' ? '#293343' : 'transparent'
            }}
          >
            <FileText size={20} />
            Member Resources
          </button>
          <button
            disabled
            className="px-6 py-4 text-left transition opacity-60 cursor-not-allowed font-bold flex items-center gap-3"
            style={{ color: '#EBF2FC' }}
          >
            <Code size={20} />
            Development
          </button>
          <button
            disabled
            className="px-6 py-4 text-left transition opacity-60 cursor-not-allowed font-bold flex items-center gap-3"
            style={{ color: '#EBF2FC' }}
          >
            <Briefcase size={20} />
            Opportunities
          </button>
          <button
            disabled
            className="px-6 py-4 text-left transition opacity-60 cursor-not-allowed font-bold flex items-center gap-3"
            style={{ color: '#EBF2FC' }}
          >
            <UserCheck size={20} />
            Member Board
          </button>
          <button
            disabled
            className="px-6 py-4 text-left transition opacity-60 cursor-not-allowed font-bold flex items-center gap-3"
            style={{ color: '#EBF2FC' }}
          >
            <Shield size={20} />
            Officer Board
          </button>
          <button
            disabled
            className="px-6 py-4 text-left transition opacity-60 cursor-not-allowed font-bold flex items-center gap-3"
            style={{ color: '#EBF2FC' }}
          >
            <User size={20} />
            My Account
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'resources' && (
          <div className="h-full overflow-auto" style={{ backgroundColor: '#FFFFFF' }}>
            {!selectedPost ? (
              <div className="max-w-4xl mx-auto p-6">
                {/* Header Card */}
                <div className="mb-6 rounded-lg p-6" style={{ backgroundColor: '#E1EBFA' }}>
                  <h1 className="text-3xl font-bold mb-3" style={{ color: '#1a1a1a' }}>Member Resources</h1>
                  <p className="text-base" style={{ color: '#4a5568' }}>
                    An interactive thread for all members to post their resources. All resources are welcome!
                  </p>
                </div>

                {/* Search and New Post */}
                <div className="mb-6 flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      placeholder="Search posts, descriptions, and comments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowNewPost(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    New Post
                  </button>
                </div>

                {/* New Post Form */}
                {showNewPost && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-300">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
                      <button onClick={() => setShowNewPost(false)} className="text-gray-600 hover:text-gray-900">
                        <X size={24} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Post Title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full px-4 py-3 mb-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                      placeholder="Post description (supports basic formatting)..."
                      value={newPost.description}
                      onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                      rows="6"
                      className="w-full px-4 py-3 mb-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowNewPost(false)}
                        className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createPost}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}

                {/* Posts Feed */}
                <div className="space-y-4">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                      {searchQuery ? 'No posts match your search' : 'No posts yet. Create the first one!'}
                    </div>
                  ) : (
                    filteredPosts.map(post => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-300 hover:border-gray-400 cursor-pointer transition"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {post.description.substring(0, 200)}
                          {post.description.length > 200 ? '...' : ''}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatTimestamp(post.timestamp)}</span>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={16} />
                            <span>{post.comments.length} comments</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              // Post Detail View
              <div className="max-w-4xl mx-auto p-6">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="mb-6 text-blue-600 hover:text-blue-700 transition font-medium"
                >
                  ← Back to posts
                </button>

                {/* Post Content */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-300 mb-6">
                  {editingPost === selectedPost.id ? (
                    <div>
                      <input
                        type="text"
                        value={editingPost === selectedPost.id ? newPost.title : selectedPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="w-full px-4 py-3 mb-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                      <textarea
                        value={editingPost === selectedPost.id ? newPost.description : selectedPost.description}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                        rows="6"
                        className="w-full px-4 py-3 mb-4 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            updatePost(selectedPost.id, { title: newPost.title, description: newPost.description });
                            setSelectedPost({ ...selectedPost, title: newPost.title, description: newPost.description });
                          }}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPost(null)}
                          className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{selectedPost.title}</h1>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPost(selectedPost.id);
                              setNewPost({ title: selectedPost.title, description: selectedPost.description });
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deletePost(selectedPost.id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap mb-4">{selectedPost.description}</p>
                      <div className="text-sm text-gray-600">
                        {formatTimestamp(selectedPost.timestamp)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Comments ({selectedPost.comments.length})
                  </h2>

                  {/* Add Comment */}
                  <div className="mb-6">
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 mb-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <button
                      onClick={() => addComment(selectedPost.id)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      Comment
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {selectedPost.comments.map(comment => (
                      <div key={comment.id} className="bg-white rounded-lg p-4 border border-gray-300">
                        {editingComment === comment.id ? (
                          <div>
                            <textarea
                              defaultValue={comment.text}
                              id={`edit-${comment.id}`}
                              rows="3"
                              className="w-full px-4 py-3 mb-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                            />
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  const newText = document.getElementById(`edit-${comment.id}`).value;
                                  updateComment(selectedPost.id, comment.id, newText);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingComment(null)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-gray-800 flex-1">{comment.text}</p>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => setEditingComment(comment.id)}
                                  className="p-1 text-gray-600 hover:text-blue-600 transition"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteComment(selectedPost.id, comment.id)}
                                  className="p-1 text-gray-600 hover:text-red-600 transition"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatTimestamp(comment.timestamp)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberResourcesApp;