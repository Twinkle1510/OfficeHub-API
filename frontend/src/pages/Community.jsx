import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trophy, Medal, Award } from 'lucide-react';

const Community = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/users/leaderboard');
        setLeaderboard(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy color="#fbbf24" size={24} />;
    if (index === 1) return <Medal color="#9ca3af" size={24} />;
    if (index === 2) return <Award color="#b45309" size={24} />;
    return <span style={{ fontWeight: 'bold', width: '24px', textAlign: 'center' }}>{index + 1}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Community Leaderboard</h1>
          <p className="dashboard-subtitle">See how you rank among other developers.</p>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading leaderboard...</p>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Rank</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Developer</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Completed Skills</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Total Tracked</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', height: '60px' }}>
                    {getRankIcon(index)}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: 'bold' }}>
                    {user.completedCount}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    {user.totalCount}
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Community;
