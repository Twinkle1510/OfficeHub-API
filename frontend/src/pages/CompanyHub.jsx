import React, { useState, useEffect } from 'react';
import { Users, Send, MessageSquare } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const CompanyHub = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      // Allow everyone to see everyone else in the company
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

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Company Hub</h1>
          <p className="dashboard-subtitle">Connect with HR, Admins, and colleagues directly.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', height: '65vh' }}>
        
        {/* User List Sidebar */}
        <div className="glass-panel" style={{ width: '30%', overflowY: 'auto', padding: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Users size={18} /> Directory
          </h3>
          {loading ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No users available to chat.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {users.map(u => (
                <button
                  key={u._id}
                  onClick={() => handleSelectUser(u)}
                  style={{
                    background: selectedUser?._id === u._id ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '1px solid var(--glass-border)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'left',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>{u.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase' }}>{u.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="glass-panel" style={{ width: '70%', display: 'flex', flexDirection: 'column', padding: '0' }}>
          {selectedUser ? (
            <>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chat with {selectedUser.name}</h2>
                  <span style={{ color: 'var(--primary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{selectedUser.role}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  End-to-End Encrypted
                </div>
              </div>
              
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No messages yet. Say hello!</p>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender._id === currentUser.id;
                    return (
                      <div key={msg._id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textAlign: isMe ? 'right' : 'left' }}>
                          {isMe ? 'You' : msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div style={{ 
                          background: isMe ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px',
                          borderBottomRightRadius: isMe ? '2px' : '12px',
                          borderBottomLeftRadius: !isMe ? '2px' : '12px',
                          border: isMe ? 'none' : '1px solid var(--glass-border)'
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={18} /> Send
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>Select someone to chat with</h3>
              <p>Employees can contact HR or Admins directly.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CompanyHub;
