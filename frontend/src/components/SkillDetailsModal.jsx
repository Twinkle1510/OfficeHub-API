import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Send, MessageSquare } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const SkillDetailsModal = ({ skill, onClose, onSave }) => {
  const [notes, setNotes] = useState(skill.notes || '');
  const [links, setLinks] = useState(skill.links ? skill.links.join('\n') : '');
  const [subTasks, setSubTasks] = useState(skill.subTasks || []);
  const [newSubTask, setNewSubTask] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchMessages();
  }, [skill._id]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/messages/task/${skill._id}`);
      setMessages(res.data.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    try {
      // Find admin to send to (defaulting to the one who assigned, or an admin role)
      // Since we don't know the exact admin ID here, we can pass null and let backend handle it, or we just need the admin ID.
      // Wait, the backend requires `receiver`. Let's assume assignedBy is available. If not, user can't send message?
      // For now, if assignedBy is null, they send it to a generic admin. We'll need to fetch an admin or just pass `assignedBy`.
      let receiverId = skill.assignedBy;
      if (!receiverId) {
         const adminRes = await api.get('/users'); // A bit heavy, but works for now to find an admin
         const admins = adminRes.data.data.filter(u => u.role === 'admin');
         if (admins.length > 0) receiverId = admins[0]._id;
      }

      if (!receiverId) {
        Swal.fire('Error', "No admin available to receive message.", 'error');
        return;
      }

      const res = await api.post('/messages', {
        task: skill._id,
        receiver: receiverId,
        content: newMessage
      });
      setMessages([...messages, res.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const handleAddSubTask = () => {
    if (newSubTask.trim() === '') return;
    setSubTasks([...subTasks, { title: newSubTask, completed: false }]);
    setNewSubTask('');
  };

  const handleToggleSubTask = (index) => {
    const updated = subTasks.map((st, i) => 
      i === index ? { ...st, completed: !st.completed } : st
    );
    setSubTasks(updated);
  };

  const handleDeleteSubTask = (index) => {
    const updated = subTasks.filter((_, i) => i !== index);
    setSubTasks(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const linksArray = links.split('\n').filter(link => link.trim() !== '');
    
    // If the user typed a sub-task but forgot to press '+', add it automatically before saving
    let finalSubTasks = [...subTasks];
    if (newSubTask.trim() !== '') {
      finalSubTasks.push({ title: newSubTask.trim(), completed: false });
      setNewSubTask('');
    }

    const total = finalSubTasks.length;
    const completed = finalSubTasks.filter(st => st.completed).length;
    
    let newStatus = 'pending';
    if (total === 0) {
      newStatus = skill.status;
    } else if (completed === 0) {
      newStatus = 'pending';
    } else if (completed === total) {
      newStatus = 'completed';
    } else {
      newStatus = 'in-progress';
    }

    onSave(skill._id, { ...skill, status: newStatus, notes, links: linksArray, subTasks: finalSubTasks });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 className="modal-title">Notes & Resources</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="skill-category">{skill.category}</span>
          <h3 style={{ marginTop: '0.5rem' }}>{skill.task}</h3>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Sub-tasks Section */}
          <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Checklist (Sub-topics)
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {subTasks.filter(s => s.completed).length} / {subTasks.length} Completed
              </span>
            </label>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Add a sub-topic (e.g. Arrow Functions)"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubTask(); } }}
              />
              <button type="button" className="btn btn-outline" onClick={handleAddSubTask}>
                <Plus size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {subTasks.map((st, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '6px' }}>
                  <input 
                    type="checkbox" 
                    checked={st.completed}
                    onChange={() => handleToggleSubTask(index)}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                  <span style={{ flex: 1, textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                    {st.title}
                  </span>
                  <button type="button" onClick={() => handleDeleteSubTask(index)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.2rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {subTasks.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No sub-topics added yet.</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">My Notes</label>
            <textarea 
              className="form-input" 
              rows="4"
              placeholder="Write your study notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Resource Links (One per line)</label>
            <textarea 
              className="form-input" 
              rows="3"
              placeholder="https://react.dev&#10;https://youtube.com/..."
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'monospace' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} style={{ marginRight: '0.5rem' }} /> Save Task Details
            </button>
          </div>
        </form>

        {/* Messaging Section */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <MessageSquare size={18} /> Updates & Chat
          </h3>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
            {loadingMessages ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No updates yet. Send a message to the admin!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.map(msg => {
                  const isMe = msg.sender._id === currentUser.id;
                  return (
                    <div key={msg._id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textAlign: isMe ? 'right' : 'left' }}>
                        {isMe ? 'You' : msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div style={{ 
                        background: isMe ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
                        padding: '0.5rem 0.75rem', 
                        borderRadius: '12px',
                        borderBottomRightRadius: isMe ? '2px' : '12px',
                        borderBottomLeftRadius: !isMe ? '2px' : '12px'
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Type an update to admin (e.g. 'I finished this!')"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleSendMessage(); } }}
            />
            <button type="button" className="btn btn-primary" onClick={handleSendMessage} style={{ padding: '0 1rem' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailsModal;
