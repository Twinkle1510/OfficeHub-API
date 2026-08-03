import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { Shield, Trash2, Users, Eye, X, Plus, Calendar, MessageSquare, Send, BarChart2 } from 'lucide-react';
import { syllabusData } from '../data/syllabus';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [taskMode, setTaskMode] = useState('syllabus'); // 'syllabus' or 'custom'
  const [newTask, setNewTask] = useState({ category: '', task: '', subTasks: [], targetDate: '' });

  // Global Assign Task State
  const [isGlobalAssignOpen, setIsGlobalAssignOpen] = useState(false);
  const [globalTaskMode, setGlobalTaskMode] = useState('syllabus'); // 'syllabus' or 'custom'
  const [globalNewTask, setGlobalNewTask] = useState({ userId: '', category: '', task: '', subTasks: [], targetDate: '' });

  // Messaging state
  const [selectedTaskForMessages, setSelectedTaskForMessages] = useState(null);
  const [taskMessages, setTaskMessages] = useState([]);
  const [newAdminMessage, setNewAdminMessage] = useState('');
  
  // Graph Data
  const [monthlyGraphData, setMonthlyGraphData] = useState([]);
  
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      setErrorMsg('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: `Are you absolutely sure you want to delete ${name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser(null);
        }
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete user', 'error');
      }
    }
  };

  const openUserProgress = async (user) => {
    setSelectedUser(user);
    setLoadingSkills(true);
    setIsAssigning(false);
    try {
      const res = await api.get(`/users/${user._id}/skills`);
      const skills = res.data.data;
      setUserSkills(skills);

      // Generate Graph Data for the current month
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      const days = eachDayOfInterval({ start, end });
      
      const graphData = days.map(day => {
        const completedOnDay = skills.filter(s => s.status === 'completed' && s.completedAt && isSameDay(parseISO(s.completedAt), day)).length;
        const assignedOnDay = skills.filter(s => s.createdAt && isSameDay(parseISO(s.createdAt), day)).length;
        return {
          date: format(day, 'MMM dd'),
          completed: completedOnDay,
          assigned: assignedOnDay
        };
      });
      setMonthlyGraphData(graphData);

    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch user progress', 'error');
    } finally {
      setLoadingSkills(false);
    }
  };

  const openTaskMessages = async (task) => {
    if (selectedTaskForMessages && selectedTaskForMessages._id === task._id) {
      setSelectedTaskForMessages(null);
      return;
    }
    setSelectedTaskForMessages(task);
    try {
      const res = await api.get(`/messages/task/${task._id}`);
      setTaskMessages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAdminMessage = async () => {
    if (newAdminMessage.trim() === '') return;
    try {
      const res = await api.post('/messages', {
        task: selectedTaskForMessages._id,
        receiver: selectedUser._id,
        content: newAdminMessage
      });
      setTaskMessages([...taskMessages, res.data.data]);
      setNewAdminMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this task from the user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${selectedUser._id}/skills/${skillId}`);
        setUserSkills(userSkills.filter(s => s._id !== skillId));
        Swal.fire('Deleted!', 'Task has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete task', 'error');
      }
    }
  };

  const handleSelectTopic = (e) => {
    const idx = e.target.value;
    if (idx === 'custom') {
      setTaskMode('custom');
      setNewTask({ category: '', task: '', subTasks: [], targetDate: newTask.targetDate });
    } else if (idx !== '') {
      setTaskMode('syllabus');
      const selected = syllabusData[idx];
      setNewTask({
        category: selected.category,
        task: selected.task,
        subTasks: selected.subTasks,
        targetDate: newTask.targetDate
      });
    }
  };

  const handleGlobalSelectTopic = (e) => {
    const idx = e.target.value;
    if (idx === 'custom') {
      setGlobalTaskMode('custom');
      setGlobalNewTask({ ...globalNewTask, category: '', task: '', subTasks: [] });
    } else if (idx !== '') {
      setGlobalTaskMode('syllabus');
      const selected = syllabusData[idx];
      setGlobalNewTask({
        ...globalNewTask,
        category: selected.category,
        task: selected.task,
        subTasks: selected.subTasks
      });
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!newTask.category || !newTask.task) {
      Swal.fire('Warning', 'Please select a topic to assign.', 'warning');
      return;
    }

    try {
      const res = await api.post(`/users/${selectedUser._id}/skills`, newTask);
      setUserSkills([res.data.data, ...userSkills]);
      setIsAssigning(false);
      setNewTask({ category: '', task: '', subTasks: [], targetDate: '' });
      Swal.fire('Success', 'Task assigned successfully!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to assign task', 'error');
    }
  };

  const handleGlobalAssignTask = async (e) => {
    e.preventDefault();
    if (!globalNewTask.userId) {
      Swal.fire('Warning', 'Please select a user first.', 'warning');
      return;
    }
    if (!globalNewTask.category || !globalNewTask.task) {
      Swal.fire('Warning', 'Please select a topic to assign.', 'warning');
      return;
    }

    try {
      await api.post(`/users/${globalNewTask.userId}/skills`, globalNewTask);
      setIsGlobalAssignOpen(false);
      setGlobalNewTask({ userId: '', category: '', task: '', subTasks: [], targetDate: '' });
      Swal.fire('Success', 'Task assigned successfully!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to assign task', 'error');
    }
  };

  if (!currentUser || !['admin', 'hr', 'owner'].includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield color="var(--primary)" size={32} />
            Admin Dashboard
          </h1>
          <p className="dashboard-subtitle">Manage users, view progress, and assign tasks.</p>
        </div>
      </div>

      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', margin: 0 }}>
            <Users size={20} /> Registered Users ({users.length})
          </h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsGlobalAssignOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Assign Task to User
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0' }}>Name</th>
                  <th style={{ padding: '1rem 0' }}>Email</th>
                  <th style={{ padding: '1rem 0' }}>Role</th>
                  <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: '500' }}>{u.name} {u._id === currentUser.id && '(You)'}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <button 
                        onClick={() => openUserProgress(u)}
                        className="action-btn"
                        title="View Progress"
                        style={{ display: 'inline-flex', marginRight: '0.5rem' }}
                      >
                        <Eye size={18} /> View Tasks
                      </button>
                      {u._id !== currentUser.id && (
                        <button 
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="action-btn delete"
                          title="Delete User"
                          style={{ display: 'inline-flex' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Progress & Assign Task Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedUser.name}'s Progress</h2>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>
                <X size={24} />
              </button>
            </div>

            {loadingSkills ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading tasks...</p>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Assigned Tasks ({userSkills.length})</h3>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsAssigning(!isAssigning)}
                    style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {isAssigning ? 'Cancel' : <><Plus size={16}/> Assign Task</>}
                  </button>
                </div>

                {isAssigning && (
                  <form onSubmit={handleAssignTask} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Select Task Option</label>
                      <select className="form-input" onChange={handleSelectTopic} defaultValue="">
                        <option value="" disabled>-- Choose a topic from syllabus or custom --</option>
                        {syllabusData.map((item, idx) => (
                          <option key={idx} value={idx}>{item.category} - {item.task}</option>
                        ))}
                        <option value="custom">✍️ Type Custom Task...</option>
                      </select>
                    </div>
                    
                    {taskMode === 'custom' && (
                      <>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                          <label className="form-label">Category</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g., Frontend"
                            value={newTask.category}
                            onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                          <label className="form-label">Task Description</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g., Learn React Hooks"
                            value={newTask.task}
                            onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                            required
                          />
                        </div>
                      </>
                    )}
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label className="form-label">Target Date (Optional)</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={newTask.targetDate}
                        onChange={(e) => setNewTask({...newTask, targetDate: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Submit Assignment</button>
                  </form>
                )}

                {/* Monthly Graph */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    <BarChart2 size={18} /> Monthly Task Progress
                  </h3>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                      <BarChart data={monthlyGraphData}>
                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)' }}
                          itemStyle={{ color: 'var(--text-main)' }}
                        />
                        <Bar dataKey="completed" fill="var(--success)" radius={[4,4,0,0]} name="Completed" />
                        <Bar dataKey="assigned" fill="var(--primary)" radius={[4,4,0,0]} name="Assigned" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {userSkills.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No tasks assigned to this user yet.</p>
                ) : (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {userSkills.map(skill => {
                      const completedCount = skill.subTasks?.filter(t => t.completed).length || 0;
                      const totalCount = skill.subTasks?.length || 0;
                      return (
                        <div key={skill._id} style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <div>
                              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{skill.task}</h4>
                              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', marginRight: '1rem' }}>{skill.category}</span>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', gap: '1rem' }}>
                                <span><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }}/> 
                                  Assigned: {format(new Date(skill.createdAt), 'MMM dd, yyyy')}
                                </span>
                                {skill.targetDate && (
                                  <span><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }}/> 
                                    Target: {format(new Date(skill.targetDate), 'MMM dd, yyyy')}
                                  </span>
                                )}
                                {skill.completedAt && (
                                  <span style={{ color: 'var(--success)' }}>
                                    Completed: {format(new Date(skill.completedAt), 'MMM dd, p')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ 
                                  display: 'block',
                                  fontSize: '0.85rem', 
                                  textTransform: 'uppercase',
                                  color: skill.status === 'completed' ? 'var(--success)' : skill.status === 'in-progress' ? 'var(--warning)' : 'var(--text-muted)'
                                }}>
                                  {skill.status === 'pending' ? 'Not Started' : skill.status.replace('-', ' ')}
                                </span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{completedCount}/{totalCount} completed</span>
                              </div>
                              <button 
                                onClick={() => openTaskMessages(skill)} 
                                className="action-btn"
                                style={{ color: selectedTaskForMessages?._id === skill._id ? 'var(--primary)' : 'var(--text-muted)' }}
                                title="Messages"
                              >
                                <MessageSquare size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteSkill(skill._id)} 
                                className="action-btn delete"
                                title="Delete Task"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          {/* Messages Expanded View */}
                          {selectedTaskForMessages && selectedTaskForMessages._id === skill._id && (
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0 0 8px 8px', border: '1px solid var(--glass-border)', borderTop: 'none', marginLeft: '1rem', marginRight: '1rem' }}>
                              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Task Updates & Messages</h5>
                              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {taskMessages.length === 0 ? (
                                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No messages yet.</p>
                                ) : (
                                  taskMessages.map(msg => {
                                    const isAdmin = msg.sender.role === 'admin';
                                    return (
                                      <div key={msg._id} style={{ alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.1rem', textAlign: isAdmin ? 'right' : 'left' }}>
                                          {isAdmin ? 'You' : msg.sender.name}
                                        </div>
                                        <div style={{ 
                                          background: isAdmin ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
                                          padding: '0.4rem 0.6rem', 
                                          borderRadius: '8px',
                                          fontSize: '0.9rem'
                                        }}>
                                          {msg.content}
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  placeholder="Reply to user..."
                                  value={newAdminMessage}
                                  onChange={(e) => setNewAdminMessage(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendAdminMessage(); }}
                                />
                                <button type="button" className="btn btn-primary" onClick={handleSendAdminMessage}>
                                  <Send size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Global Assign Task Modal */}
      {isGlobalAssignOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Assign New Task</h2>
              <button className="close-btn" onClick={() => setIsGlobalAssignOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleGlobalAssignTask} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select User</label>
                <select 
                  className="form-input" 
                  value={globalNewTask.userId}
                  onChange={(e) => setGlobalNewTask({...globalNewTask, userId: e.target.value})}
                  required
                >
                  <option value="">-- Choose a user --</option>
                  {users.filter(u => u._id !== currentUser.id).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Task Option</label>
                <select className="form-input" onChange={handleGlobalSelectTopic} defaultValue="">
                  <option value="" disabled>-- Choose a topic from syllabus or custom --</option>
                  {syllabusData.map((item, idx) => (
                    <option key={idx} value={idx}>{item.category} - {item.task}</option>
                  ))}
                  <option value="custom">✍️ Type Custom Task...</option>
                </select>
              </div>

              {globalTaskMode === 'custom' && (
                <>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Category</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g., Backend"
                      value={globalNewTask.category}
                      onChange={(e) => setGlobalNewTask({...globalNewTask, category: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Task Description</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g., Build REST API"
                      value={globalNewTask.task}
                      onChange={(e) => setGlobalNewTask({...globalNewTask, task: e.target.value})}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Target Date (Optional)</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={globalNewTask.targetDate}
                  onChange={(e) => setGlobalNewTask({...globalNewTask, targetDate: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsGlobalAssignOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
