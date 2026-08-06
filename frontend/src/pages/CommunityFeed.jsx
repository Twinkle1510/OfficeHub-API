import React, { useState, useEffect } from 'react';
import api from '../api';
import { Activity, CheckCircle2, PlayCircle, Heart, MessageCircle, Send, Flame } from 'lucide-react';
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
    <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Flame size={32} color="var(--rose)" /> Live Community Feed
          </h1>
          <p className="dashboard-subtitle">Real-time learning updates and milestones across your organization.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <p>Loading live activity feed...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="empty-state">
          <Activity size={48} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>No activity recorded yet</h3>
          <p>Start or complete a skill task to publish your first activity milestone!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activities.map((act) => (
            <div key={act._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: act.action === 'started' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                border: act.action === 'started' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                color: act.action === 'started' ? 'var(--primary)' : 'var(--emerald)'
              }}>
                {act.action === 'started' ? <PlayCircle size={22} /> : <CheckCircle2 size={22} />}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '1.05rem', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>{act.user?.name || 'Anonymous User'}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {act.action === 'started' ? ' started learning ' : ' completed '}
                  </span>
                  <strong style={{ color: act.action === 'started' ? 'var(--primary)' : 'var(--emerald)', fontWeight: 700 }}>
                    {act.skillTitle}
                  </strong>
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
                  <span className="skill-category-badge">
                    {act.category}
                  </span>
                  <span style={{ color: 'var(--text-subtle)' }}>
                    {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                {/* Interactions */}
                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem' }}>
                  <button 
                    onClick={() => handleLike(act._id)}
                    style={{ 
                      background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem', 
                      color: (act.likes && act.likes.includes(user?._id)) ? 'var(--rose)' : 'var(--text-muted)', 
                      cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'color 0.2s'
                    }}
                  >
                    <Heart size={17} fill={(act.likes && act.likes.includes(user?._id)) ? 'var(--rose)' : 'none'} />
                    {act.likes ? act.likes.length : 0} Likes
                  </button>
                  
                  <button 
                    onClick={() => toggleComments(act._id)}
                    style={{ 
                      background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem', 
                      color: openComments[act._id] ? 'var(--primary)' : 'var(--text-muted)', 
                      cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'color 0.2s'
                    }}
                  >
                    <MessageCircle size={17} />
                    {act.comments ? act.comments.length : 0} Comments
                  </button>
                </div>

                {/* Comments Section */}
                {openComments[act._id] && (
                  <div style={{ marginTop: '1rem', background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    {act.comments && act.comments.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                        {act.comments.map((comment, i) => (
                          <div key={i} style={{ fontSize: '0.875rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
                            <strong style={{ color: 'var(--primary)' }}>{comment.user?.name}:</strong>
                            <span style={{ color: 'var(--text-main)' }}>{comment.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>No comments yet. Be the first to reply!</p>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <input 
                        type="text" 
                        value={commentText[act._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [act._id]: e.target.value })}
                        placeholder="Write a comment..." 
                        className="form-input"
                        style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }} 
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(act._id)}
                      />
                      <button 
                        onClick={() => handleAddComment(act._id)}
                        className="btn btn-primary"
                        style={{ padding: '0.6rem 1rem', borderRadius: '10px' }}
                      >
                        <Send size={15} />
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
