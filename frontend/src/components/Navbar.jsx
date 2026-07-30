import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X, Settings as SettingsIcon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
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

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={token ? "/dashboard" : "/"} className="nav-brand" onClick={closeMenu}>
          <LayoutDashboard className="nav-brand-icon" size={28} />
          OfficeHub ERP
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'none' }}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {token ? (
            <>
              <li><Link to="/dashboard" className="nav-item" onClick={closeMenu}>Dashboard</Link></li>
              <li><Link to="/community" className="nav-item" style={{ color: 'var(--primary)', fontWeight: 'bold' }} onClick={closeMenu}>Live Feed 🟢</Link></li>
              <li><Link to="/company-hub" className="nav-item" onClick={closeMenu} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Company Hub 💬</Link></li>
              <li><Link to="/leaderboard" className="nav-item" onClick={closeMenu}>Leaderboard</Link></li>
              <li><Link to="/profile" className="nav-item" onClick={closeMenu}>Profile</Link></li>
              <li><Link to="/settings" className="nav-item" onClick={closeMenu} title="Settings"><SettingsIcon size={20} /></Link></li>
              
              {['admin', 'hr', 'owner'].includes(user?.role) && (
                <li>
                  <Link to="/admin" className="nav-item" onClick={closeMenu} style={{ color: '#ec4899', fontWeight: 'bold' }}>
                    🛡️ {user?.role === 'hr' ? 'HR Panel' : 'Admin Panel'}
                  </Link>
                </li>
              )}
              
              <li className="nav-divider" style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>|</li>
              <li className="nav-item" style={{ cursor: 'default' }}>Hi, {user?.name?.split(' ')[0]}</li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-item" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" className="btn btn-primary" onClick={closeMenu}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
