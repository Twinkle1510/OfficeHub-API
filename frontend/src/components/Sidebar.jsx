import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Flame, MessageSquare, Trophy, User, Settings as SettingsIcon, LogOut, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-nav">
      <div>
        {/* Brand */}
        <Link to="/dashboard" className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <LayoutDashboard size={20} />
          </div>
          <span className="brand-text">DevSkills<span className="text-gradient">.pro</span></span>
        </Link>

        {/* Menu Navigation */}
        <div className="sidebar-menu">
          <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link to="/community" className={`sidebar-link ${isActive('/community') ? 'active' : ''}`}>
            <Flame size={18} style={{ color: isActive('/community') ? '#fff' : 'var(--rose)' }} />
            <span>Live Feed</span>
          </Link>

          <Link to="/company-hub" className={`sidebar-link ${isActive('/company-hub') ? 'active' : ''}`}>
            <MessageSquare size={18} style={{ color: isActive('/company-hub') ? '#fff' : 'var(--violet)' }} />
            <span>Company Hub</span>
          </Link>

          <Link to="/leaderboard" className={`sidebar-link ${isActive('/leaderboard') ? 'active' : ''}`}>
            <Trophy size={18} style={{ color: isActive('/leaderboard') ? '#fff' : 'var(--amber)' }} />
            <span>Leaderboard</span>
          </Link>

          <Link to="/profile" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
            <User size={18} />
            <span>Profile</span>
          </Link>

          <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}>
            <SettingsIcon size={18} />
            <span>Settings</span>
          </Link>

          {['admin', 'hr', 'owner'].includes(user?.role) && (
            <Link 
              to="/admin" 
              className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}
              style={{
                marginTop: '0.5rem',
                background: isActive('/admin') ? 'var(--gradient-primary)' : 'rgba(244, 63, 94, 0.12)',
                color: isActive('/admin') ? '#fff' : 'var(--rose)',
                border: '1px solid rgba(244, 63, 94, 0.25)'
              }}
            >
              <ShieldAlert size={18} />
              <span>{user?.role === 'hr' ? 'HR Panel' : 'Admin Panel'}</span>
            </Link>
          )}
        </div>
      </div>

      {/* User Info & Logout Footer */}
      <div className="sidebar-user-footer">
        <div className="user-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-details" style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name || 'Developer'}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--violet)', textTransform: 'uppercase', fontWeight: 600 }}>
            {user?.role || 'User'}
          </div>
        </div>
        <button 
          onClick={handleLogout}
          title="Logout"
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.35rem',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
