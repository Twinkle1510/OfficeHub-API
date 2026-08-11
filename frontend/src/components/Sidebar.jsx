import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Flame, MessageSquare, Trophy, User, Settings as SettingsIcon, LogOut, ShieldAlert, Calendar, Layers, DollarSign, Laptop, FileText, X } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
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
    <>
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <aside className={`sidebar-nav ${isSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
          <Link to="/dashboard" className="sidebar-brand" style={{ marginBottom: 0 }}>
            <div className="sidebar-brand-icon">
              <LayoutDashboard size={20} />
            </div>
            <span className="brand-text">DevSkills<span className="text-gradient">.pro</span></span>
          </Link>
          <button 
            className="mobile-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Navigation */}
        <div className="sidebar-menu" onClick={() => { if(window.innerWidth <= 768) setIsSidebarOpen(false); }}>
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

          <Link to="/projects" className={`sidebar-link ${isActive('/projects') ? 'active' : ''}`}>
            <Layers size={18} style={{ color: isActive('/projects') ? '#fff' : 'var(--cyan)' }} />
            <span>Sprint Board</span>
          </Link>

          <Link to="/payroll" className={`sidebar-link ${isActive('/payroll') ? 'active' : ''}`}>
            <DollarSign size={18} style={{ color: isActive('/payroll') ? '#fff' : 'var(--emerald)' }} />
            <span>Payroll & Paystubs</span>
          </Link>

          <Link to="/leave" className={`sidebar-link ${isActive('/leave') ? 'active' : ''}`}>
            <Calendar size={18} style={{ color: isActive('/leave') ? '#fff' : 'var(--emerald)' }} />
            <span>Leave System</span>
          </Link>

          <Link to="/assets" className={`sidebar-link ${isActive('/assets') ? 'active' : ''}`}>
            <Laptop size={18} style={{ color: isActive('/assets') ? '#fff' : 'var(--violet)' }} />
            <span>Hardware Assets</span>
          </Link>

          <Link to="/policy" className={`sidebar-link ${isActive('/policy') ? 'active' : ''}`}>
            <FileText size={18} style={{ color: isActive('/policy') ? '#fff' : 'var(--amber)' }} />
            <span>Policy & Holidays</span>
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
    </>
  );
};

export default Sidebar;
