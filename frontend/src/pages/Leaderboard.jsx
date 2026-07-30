import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/users/leaderboard');
        setUsers(res.data.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy color="#fbbf24" size={24} />;
    if (index === 1) return <Medal color="#94a3b8" size={24} />;
    if (index === 2) return <Award color="#b45309" size={24} />;
    return <span style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>{index + 1}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy color="#fbbf24" /> Community Leaderboard
          </h1>
          <p className="dashboard-subtitle">See who is leading the charts in task completion!</p>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading leaderboard...</p>
      ) : users.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No users found.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px 150px', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', fontWeight: 'bold', color: 'var(--text-muted)' }}>
            <div>Rank</div>
            <div>Developer Name</div>
            <div style={{ textAlign: 'center' }}>Completed</div>
            <div style={{ textAlign: 'center' }}>Total Tracked</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {users.map((user, index) => (
              <div 
                key={user._id} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 1fr 150px 150px', 
                  padding: '1.25rem 1.5rem',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  alignItems: 'center',
                  background: index < 3 ? `rgba(255,255,255,${0.03 - index * 0.01})` : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {getRankIcon(index)}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: index === 0 ? '#fbbf24' : 'var(--text-main)' }}>
                  {user.name}
                </div>
                <div style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {user.completedCount}
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  {user.totalCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
