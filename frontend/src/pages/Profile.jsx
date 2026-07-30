import React, { useState, useEffect } from 'react';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


const Profile = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Profile & Analytics</h1>
          <p className="dashboard-subtitle">{user?.name} ({user?.email})</p>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics...</p>
      ) : !stats ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Could not load profile data. Please try logging out and logging back in.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>My Badges</h3>
            {stats.badges && stats.badges.length > 0 ? (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {stats.badges.map(badge => (
                  <div key={badge.id} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '250px' }}>
                    <div style={{ fontSize: '2.5rem' }}>{badge.icon}</div>
                    <div>
                      <h4 style={{ color: 'var(--primary)', marginBottom: '0.2rem' }}>{badge.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No badges earned yet. Complete tasks to earn badges!
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.total}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Tracked</div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.completed}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Completed</div>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.inProgress}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>In Progress</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.pending}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pending</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Overall Progress Breakdown</h3>
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: stats.completed, fill: '#10b981' },
                      { name: 'In Progress', value: stats.inProgress, fill: '#f59e0b' },
                      { name: 'Pending', value: stats.pending, fill: '#6366f1' }
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    { [
                      { name: 'Completed', value: stats.completed, fill: '#10b981' },
                      { name: 'In Progress', value: stats.inProgress, fill: '#f59e0b' },
                      { name: 'Pending', value: stats.pending, fill: '#6366f1' }
                    ].filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>No skills to display yet.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Profile;
