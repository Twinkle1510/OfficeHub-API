import React from 'react';
import { Search, Sparkles, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  if (!token) return null;

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
