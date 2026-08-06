import React from 'react';
import { Search, Sparkles, Bell, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';

const Header = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  if (!token) return null;

  const handleSeedDemoData = async () => {
    try {
      await api.post('/auth/seed-demo');
      Swal.fire({
        title: 'Demo Data Loaded! 🎉',
        text: '10 genuine sample entries created across Skills, Kanban Sprint Board, Company Assets & Attendance!',
        icon: 'success',
        confirmButtonText: 'View Workspace'
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Notice', 'Sample data loaded or already exists in database.', 'info');
    }
  };

  return (
    <header className="top-header">
      {/* Search Input */}
      <div className="header-search">
        <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Global search or shortcut..." 
          onClick={() => navigate('/dashboard')}
        />
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Seed 10 Demo Items Button */}
        <button
          onClick={handleSeedDemoData}
          title="Populate 10 sample test entries across system"
          style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid var(--border-highlight)',
            color: 'var(--primary)',
            padding: '0.4rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.775rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}
        >
          <Database size={13} /> ⚡ Load 10 Demo Entries
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.775rem',
          fontWeight: '700',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          background: 'rgba(168, 85, 247, 0.12)',
          color: 'var(--violet)',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }}>
          <Sparkles size={13} /> {user?.role ? user.role.toUpperCase() : 'MEMBER'} WORKSPACE
        </div>

        <button 
          title="Notifications"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-muted)',
            padding: '0.5rem',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;
