'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCommentsByBlogPost, createComment, type Comment } from '@/api/comment';
import { MessageCircle, Send, User } from 'lucide-react';

interface CommentSectionProps {
  blogPostId: string;
}

export default function CommentSection({ blogPostId }: CommentSectionProps) {
  const { isLoggedIn, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [blogPostId]);

  const loadComments = async () => {
    setLoading(true);
    const result = await getCommentsByBlogPost(blogPostId);
    if (result.success) {
      setComments(result.comments);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!message.trim()) {
      setError('Please enter a comment');
      return;
    }

    if (!isLoggedIn) {
      if (!name.trim() || !email.trim()) {
        setError('Name and email are required for anonymous comments');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setSubmitting(true);

    const commentData = {
      blogPostId,
      message: message.trim(),
      ...((!isLoggedIn) && {
        name: name.trim(),
        email: email.trim(),
      }),
    };

    const result = await createComment(commentData);

    if (result.success && result.comment) {
      setSuccess('Comment posted successfully!');
      setMessage('');
      if (!isLoggedIn) {
        setName('');
        setEmail('');
      }
      // Reload comments
      await loadComments();
    } else {
      setError(result.message || 'Failed to post comment');
    }

    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-12 border-t-2 border-pink-100 pt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageCircle className="w-8 h-8 text-pink-600" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Leave a Comment
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoggedIn && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-pink-50 px-4 py-2 rounded-lg">
              <User className="w-4 h-4 text-pink-600" />
              <span>Posting as <strong>{user?.firstName} {user?.lastName}</strong></span>
            </div>
          )}

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Comment *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900"
              placeholder="Share your thoughts..."
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                    {!comment.isAnonymous && (
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                        Verified User
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2 whitespace-pre-wrap">{comment.message}</p>
                  <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
