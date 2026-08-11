import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Bell, Database, Menu, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';

const Header = ({ setIsSidebarOpen }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  if (!token) return null;

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsSidebarOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.5rem',
            marginRight: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={24} />
        </button>

        {/* Search Input */}
        <div className="header-search">
        <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Global search or shortcut..." 
          onClick={() => navigate('/dashboard')}
        />
      </div>
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

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
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
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--rose)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: '0',
              width: '320px',
              background: '#090c1e',
              border: '1px solid var(--border-highlight)',
              borderRadius: '12px',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
              zIndex: 50,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ padding: '0.5rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      style={{ 
                        padding: '0.75rem', 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: notif.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                        borderRadius: '8px',
                        marginBottom: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                        <strong style={{ fontSize: '0.85rem', color: notif.isRead ? 'var(--text-main)' : 'var(--primary)' }}>
                          {notif.title}
                        </strong>
                        {!notif.isRead && (
                          <button onClick={() => markAsRead(notif._id)} style={{ background: 'none', border: 'none', color: 'var(--emerald)', cursor: 'pointer', padding: '0' }}>
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                        {notif.message}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.4rem', display: 'block' }}>
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
