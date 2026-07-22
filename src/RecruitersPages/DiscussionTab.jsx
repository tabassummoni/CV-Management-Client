import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api.jsx';

const DiscussionTab = ({ positionId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const commentsEndRef = useRef(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(new URL(`/api/comments/position/${positionId}`, API_BASE_URL).href);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(() => {
      fetchComments();
    }, 4000);

    return () => clearInterval(interval);
  }, [positionId]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(new URL(`/api/comments/position/${positionId}`, API_BASE_URL).href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, userId: currentUserId })
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-base-300 rounded-2xl p-4 border border-white/5">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {comments.map((comment) => (
          <div key={comment.id} className="chat chat-start">
            <div className="chat-header text-xs opacity-60 mb-1 flex items-center gap-2">
              <span className="font-bold text-white">{comment.user?.name || 'User'}</span>
              <span>{new Date(comment.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="chat-bubble bg-base-200 text-base-content border border-white/5 rounded-2xl max-w-md whitespace-pre-line text-sm">
              {comment.content}
            </div>
          </div>
        ))}
        <div ref={commentsEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/5 pt-3">
        <input
          type="text"
          placeholder="Write a comment... (Markdown supported)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="input input-bordered input-md rounded-xl bg-base-200 text-white flex-1 focus:border-primary text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="btn btn-primary rounded-xl text-white font-bold px-6 text-sm"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default DiscussionTab;