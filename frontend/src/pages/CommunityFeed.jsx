import React, { useState, useEffect } from 'react';
import api from '../api';
import { Activity, CheckCircle, PlayCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CommunityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

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
    // Refresh every 30 seconds
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);
  }, []);

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
