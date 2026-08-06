import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X, Settings as SettingsIcon, MessageSquare, Flame, Trophy, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const closeMenu = () => setMobileMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={token ? "/dashboard" : "/"} className="nav-brand" onClick={closeMenu}>
          <div className="nav-brand-badge">
            <LayoutDashboard size={22} />
          </div>
          <span>DevSkills<span className="text-gradient">.pro</span></span>
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'none' }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {token ? (
            <>
              <li>
                <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMenu}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/community" className={`nav-item ${isActive('/community') ? 'active' : ''}`} onClick={closeMenu}>
                  <Flame size={16} style={{ color: 'var(--rose)' }} /> Live Feed
                </Link>
              </li>
              <li>
                <Link to="/company-hub" className={`nav-item ${isActive('/company-hub') ? 'active' : ''}`} onClick={closeMenu}>
                  <MessageSquare size={16} style={{ color: 'var(--violet)' }} /> Company Hub
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className={`nav-item ${isActive('/leaderboard') ? 'active' : ''}`} onClick={closeMenu}>
                  <Trophy size={16} style={{ color: 'var(--amber)' }} /> Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`} onClick={closeMenu}>
                  <User size={16} /> Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`} onClick={closeMenu} title="Settings">
                  <SettingsIcon size={18} />
                </Link>
              </li>
              
              {['admin', 'hr', 'owner'].includes(user?.role) && (
                <li>
                  <Link 
                    to="/admin" 
                    className={`nav-item ${isActive('/admin') ? 'active' : ''}`} 
                    onClick={closeMenu} 
                    style={{ 
                      background: 'rgba(244, 63, 94, 0.12)', 
                      color: 'var(--rose)',
                      border: '1px solid rgba(244, 63, 94, 0.25)',
                      borderRadius: '10px'
                    }}
                  >
                    🛡️ {user?.role === 'hr' ? 'HR Panel' : 'Admin Panel'}
                  </Link>
                </li>
              )}
              
              <li style={{ height: '20px', width: '1px', background: 'var(--border-light)', margin: '0 0.5rem' }}></li>
              
              <li className="nav-item" style={{ cursor: 'default', color: 'var(--text-main)', fontWeight: 600 }}>
                {user?.name?.split(' ')[0]}
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  <LogOut size={15} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-item" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" className="btn btn-primary" onClick={closeMenu}>Get Started</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
