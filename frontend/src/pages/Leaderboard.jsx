import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trophy, Medal, Award, Flame } from 'lucide-react';

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

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src="https://media.giphy.com/media/26n61G2A169n0XnVu/giphy.gif" 
            alt="1st Rank" 
            style={{ width: '42px', height: '42px', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))' }} 
          />
        </div>
      );
    }
    if (index === 1) {
      return (
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 10px rgba(148, 163, 184, 0.3)', fontWeight: 'bold'
        }}>
          <Medal size={16} />
        </div>
      );
    }
    if (index === 2) {
      return (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 10px rgba(180, 83, 9, 0.3)', fontWeight: 'bold'
        }}>
          <Award size={15} />
        </div>
      );
    }
    return (
      <span style={{ 
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.9rem'
      }}>
        #{index + 1}
      </span>
    );
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '860px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Trophy size={32} color="var(--amber)" /> Global Leaderboard
          </h1>
          <p className="dashboard-subtitle">See who is leading the development charts in completion velocity!</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <p>Loading leaderboard rankings...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <Trophy size={48} style={{ marginBottom: '1rem', color: 'var(--amber)' }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>The arena is empty</h3>
          <p>Be the first developer to track and complete a skill!</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          
          {/* Table Header */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: '80px 1fr 140px 140px', 
            padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.9)', 
            fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div style={{ textAlign: 'center' }}>Rank</div>
            <div>Developer Name</div>
            <div style={{ textAlign: 'center' }}>Completed</div>
            <div style={{ textAlign: 'center' }}>Total Tracked</div>
          </div>

          {/* Table Body */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {users.map((user, index) => (
              <div 
                key={user._id} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 1fr 140px 140px', 
                  padding: '1.1rem 1.5rem',
                  borderBottom: '1px solid var(--border-light)',
                  alignItems: 'center',
                  background: index === 0 ? 'rgba(245, 158, 11, 0.05)' : (index === 1 ? 'rgba(148, 163, 184, 0.03)' : (index === 2 ? 'rgba(180, 83, 9, 0.02)' : 'transparent')),
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getRankBadge(index)}
                </div>
                
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: index === 0 ? 'var(--amber)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {user.name}
                  {index === 0 && <Flame size={16} color="var(--amber)" />}
                </div>
                
                <div style={{ textAlign: 'center', color: 'var(--emerald)', fontWeight: '800', fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
                  {user.completedCount}
                </div>
                
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
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
