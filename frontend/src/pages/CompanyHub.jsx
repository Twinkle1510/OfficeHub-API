import React, { useState, useEffect } from 'react';
import { Users, Send, MessageSquare, ShieldCheck, Megaphone, Plus, BellRing } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const CompanyHub = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Company Announcement Broadcast State
  const [announcements, setAnnouncements] = useState([
    { id: 1, author: 'HR Department', role: 'HR', text: '📢 Welcome to the Q3 Sprint! Please review your assigned skill targets in the dashboard.', time: '2 hours ago' }
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isHRorAdmin = ['admin', 'hr', 'owner'].includes(currentUser?.role);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      let availableUsers = res.data.data.filter(u => u._id !== currentUser.id);
      
      setUsers(availableUsers);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load company directory', 'error');
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/direct/${userId}`);
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      const res = await api.post('/messages', {
        receiver: selectedUser._id,
        content: newMessage
      });
      setMessages([...messages, res.data.data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to send message', 'error');
    }
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    const created = {
      id: Date.now(),
      author: currentUser.name,
      role: currentUser.role.toUpperCase(),
      text: newAnnouncement,
      time: 'Just now'
    };

    setAnnouncements([created, ...announcements]);
    setNewAnnouncement('');
    setIsPostingAnnouncement(false);
    Swal.fire('Broadcast Sent!', 'Company announcement published to all members.', 'success');
  };

  return (
    <div className="animate-fade-in">
      
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="dashboard-title">Company Hub <span className="text-gradient">💬</span></h1>
          <p className="dashboard-subtitle">Direct employee messaging, HR support, and company announcements.</p>
        </div>
        {isHRorAdmin && (
          <button 
            className="btn btn-primary" 
            onClick={() => setIsPostingAnnouncement(!isPostingAnnouncement)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Megaphone size={18} /> {isPostingAnnouncement ? 'Close Broadcast' : 'Post Announcement'}
          </button>
        )}
      </div>

      {/* HR Announcement Posting Form */}
      {isPostingAnnouncement && (
        <form onSubmit={handlePostAnnouncement} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-highlight)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--violet)' }}>
            <Megaphone size={18} /> Broadcast Announcement to All Employees
          </h3>
          <textarea 
            className="form-input" 
            rows={3} 
            placeholder="Type company notice or HR message..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            style={{ marginBottom: '1rem', resize: 'none' }}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsPostingAnnouncement(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Publish Announcement</button>
          </div>
        </form>
      )}

      {/* Announcements Banner List */}
      {announcements.length > 0 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {announcements.map(ann => (
            <div key={ann.id} style={{
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: '10px', color: '#fff', display: 'flex' }}>
                <BellRing size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{ann.author}</span>
                  <span className="skill-category-badge" style={{ fontSize: '0.65rem' }}>{ann.role}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginLeft: 'auto' }}>{ann.time}</span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.925rem' }}>{ann.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messaging Grid */}
      <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        
        {/* User List Sidebar */}
        <div className="glass-panel" style={{ width: '30%', minWidth: '260px', height: '100%', overflowY: 'auto', padding: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '1rem' }}>
            <Users size={18} color="var(--primary)" /> Team Directory
          </h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <p>Loading directory...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No users available to chat.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {users.map(u => {
                const isSelected = selectedUser?._id === u._id;
                return (
                  <button
                    key={u._id}
                    onClick={() => handleSelectUser(u)}
                    style={{
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid var(--border-highlight)' : '1px solid var(--border-light)',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      textAlign: 'left',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.role}</div>
                    </div>
                    {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Viewport */}
        <div className="glass-panel" style={{ flex: 1, minWidth: '320px', height: '100%', display: 'flex', flexDirection: 'column', padding: '0' }}>
          {selectedUser ? (
            <>
              {/* Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', background: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{selectedUser.name}</h2>
                  <span className="skill-category-badge" style={{ marginTop: '0.25rem', display: 'inline-block' }}>{selectedUser.role}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald)', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <ShieldCheck size={14} /> Encrypted Workspace Channel
                </div>
              </div>
              
              {/* Messages Body */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                    <p style={{ fontSize: '0.9rem' }}>No messages yet. Send a message to start the conversation!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender._id === currentUser.id;
                    return (
                      <div key={msg._id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.25rem', textAlign: isMe ? 'right' : 'left' }}>
                          {isMe ? 'You' : msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div style={{ 
                          background: isMe ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)', 
                          color: 'white',
                          padding: '0.8rem 1.1rem', 
                          borderRadius: '14px',
                          borderBottomRightRadius: isMe ? '2px' : '14px',
                          borderBottomLeftRadius: !isMe ? '2px' : '14px',
                          border: isMe ? 'none' : '1px solid var(--border-light)',
                          boxShadow: isMe ? '0 4px 15px -3px rgba(99, 102, 241, 0.4)' : 'none',
                          fontSize: '0.925rem'
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={`Message ${selectedUser.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                  <Send size={16} /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state" style={{ flex: 1 }}>
              <div className="empty-state-icon">
                <MessageSquare size={28} />
              </div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Select a team member</h3>
              <p style={{ fontSize: '0.9rem' }}>Choose anyone from the directory on the left to begin messaging.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CompanyHub;
