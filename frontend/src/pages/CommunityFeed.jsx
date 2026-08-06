import React, { useState, useEffect } from 'react';
import api from '../api';
import { Activity, CheckCircle, PlayCircle, Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CommunityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get('/activities');
        setActivities(res.data.data);
      } catch (err) {
        console.error('Failed to load feed', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeed();
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = async (id) => {
    try {
      const res = await api.put(`/activities/${id}/like`);
      // Update locally
      setActivities(activities.map(act => act._id === id ? { ...act, likes: res.data.data.likes } : act));
    } catch (err) {
      console.error('Failed to like', err);
    }
  };

  const handleAddComment = async (id) => {
    if (!commentText[id] || !commentText[id].trim()) return;
    try {
      const res = await api.post(`/activities/${id}/comment`, { text: commentText[id] });
      setActivities(activities.map(act => act._id === id ? res.data.data : act));
      setCommentText({ ...commentText, [id]: '' });
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const toggleComments = (id) => {
    setOpenComments({ ...openComments, [id]: !openComments[id] });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity color="var(--primary)" /> Live Community Feed
          </h1>
          <p className="dashboard-subtitle">See what other developers are learning right now.</p>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading live feed...</p>
      ) : activities.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No activities yet. Start learning to see updates here!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map((act) => (
            <div key={act._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ marginTop: '0.2rem' }}>
                {act.action === 'started' ? (
                  <PlayCircle color="var(--primary)" size={24} />
                ) : (
                  <CheckCircle color="var(--success)" size={24} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                  <strong style={{ color: 'var(--text-main)' }}>{act.user?.name || 'Anonymous User'}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {act.action === 'started' ? ' started learning ' : ' just completed '}
                  </span>
                  <strong style={{ color: act.action === 'started' ? 'var(--primary)' : 'var(--success)' }}>
                    {act.skillTitle}
                  </strong>
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                    {act.category}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                {/* Interactions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                  <button 
                    onClick={() => handleLike(act._id)}
                    style={{ 
                      background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', 
                      color: (act.likes && act.likes.includes(user?._id)) ? 'var(--danger)' : 'var(--text-muted)', 
                      cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s'
                    }}
                  >
                    <Heart size={18} fill={(act.likes && act.likes.includes(user?._id)) ? 'var(--danger)' : 'none'} />
                    {act.likes ? act.likes.length : 0}
                  </button>
                  <button 
                    onClick={() => toggleComments(act._id)}
                    style={{ 
                      background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', 
                      color: openComments[act._id] ? 'var(--primary)' : 'var(--text-muted)', 
                      cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s'
                    }}
                  >
                    <MessageCircle size={18} />
                    {act.comments ? act.comments.length : 0}
                  </button>
                </div>

                {/* Comments Section */}
                {openComments[act._id] && (
                  <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                    {act.comments && act.comments.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                        {act.comments.map((comment, i) => (
                          <div key={i} style={{ fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                            <strong style={{ color: 'var(--text-main)' }}>{comment.user?.name}:</strong>
                            <span style={{ color: 'var(--text-muted)' }}>{comment.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>No comments yet. Be the first to reply!</p>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={commentText[act._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [act._id]: e.target.value })}
                        placeholder="Write a comment..." 
                        style={{ 
                          flex: 1, padding: '0.6rem 1rem', borderRadius: '20px', 
                          border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', 
                          color: 'var(--text-main)', outline: 'none'
                        }} 
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(act._id)}
                      />
                      <button 
                        onClick={() => handleAddComment(act._id)}
                        style={{ 
                          background: 'var(--primary)', border: 'none', color: '#fff', 
                          width: '36px', height: '36px', borderRadius: '50%', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
