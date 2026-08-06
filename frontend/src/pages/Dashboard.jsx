import React, { useState, useEffect } from 'react';
import { Plus, X, BarChart2, CheckCircle2, Clock, Target, Layers, Search, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api';
import SkillCard from '../components/SkillCard';
import SkillDetailsModal from '../components/SkillDetailsModal';
import { syllabusData } from '../data/syllabus';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ category: '', task: '', subTasks: [] });
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Error fetching skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkill = async (id, updatedData) => {
    try {
      const res = await api.put(`/skills/${id}`, updatedData);
      setSkills(skills.map(s => s._id === id ? res.data.data : s));
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update task', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this task?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      try {
        await api.delete(`/skills/${id}`);
        setSkills(skills.filter(s => s._id !== id));
        Swal.fire('Deleted!', 'Task has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete task', 'error');
      }
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.category || !newTask.task) {
      Swal.fire('Warning', 'Please enter both category and task.', 'warning');
      return;
    }

    let finalSubTasks = [];
    const matchedTopic = syllabusData.find(
      item => item.task.toLowerCase() === newTask.task.toLowerCase().trim()
    );

    if (matchedTopic) {
      finalSubTasks = matchedTopic.subTasks;
    }

    try {
      const payload = { ...newTask, subTasks: finalSubTasks };
      const res = await api.post('/skills', payload);
      setSkills([res.data.data, ...skills]);
      setIsModalOpen(false);
      setNewTask({ category: '', task: '', subTasks: [] });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'Failed to save task.', 'error');
    }
  };

  // Filter and Search Logic
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.task.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === 'All') return true;
    if (filter === 'Completed') return skill.status === 'completed';
    if (filter === 'In Progress') return skill.status === 'in-progress';
    if (filter === 'Not Started') return skill.status === 'pending';
    return true;
  });

  // KPI Calculations
  const completedCount = skills.filter(s => s.status === 'completed').length;
  const inProgressCount = skills.filter(s => s.status === 'in-progress').length;
  const totalCount = skills.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Analytics computations
  const statusStats = [
    { name: 'Pending', count: skills.filter(s => s.status === 'pending').length },
    { name: 'In Progress', count: inProgressCount },
    { name: 'Completed', count: completedCount }
  ];

  const categoryMap = {};
  skills.forEach(s => {
    categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
  });
  const categoryStats = Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] }));
  const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#06b6d4'];

  return (
    <div className="animate-fade-in">
      
      {/* Header Bar */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Learning Workspace <span className="text-gradient">.pro</span>
          </h1>
          <p className="dashboard-subtitle">Track your progress and roadmap across your tech stack.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Skill
        </button>
      </div>

      {/* KPI Stats Summary Row */}
      {skills.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
              <Layers size={22} />
            </div>
            <div>
              <div className="stat-value">{totalCount}</div>
              <div className="stat-label">Total Tracked</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-value" style={{ color: 'var(--emerald)' }}>{completedCount}</div>
              <div className="stat-label">Completed Skills</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-value" style={{ color: 'var(--amber)' }}>{inProgressCount}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.12)', color: 'var(--purple)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
              <Target size={22} />
            </div>
            <div>
              <div className="stat-value" style={{ color: 'var(--purple)' }}>{completionRate}%</div>
              <div className="stat-label">Completion Velocity</div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Section */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={20} color="var(--primary)" /> Learning Analytics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            <div className="glass-panel" style={{ padding: '1.5rem', height: '280px' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status Distribution</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={statusStats} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" allowDecimals={false} fontSize={12} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid var(--border-light)', borderRadius: '10px' }} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="glass-panel" style={{ padding: '1.5rem', height: '280px' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category Breakdown</h3>
              <ResponsiveContainer width="100%" height="75%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid var(--border-light)', borderRadius: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '-10px' }}>
                {categoryStats.map((entry, index) => (
                  <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <input 
            type="text" 
            placeholder="Search topics or categories..." 
            className="form-input" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-secondary)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
          {['All', 'Not Started', 'In Progress', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--primary)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <Sparkles className="status-dot pulse" size={24} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
          <p>Loading learning skills...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Layers size={28} />
          </div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.2rem' }}>No skills in your roadmap yet</h3>
          <p style={{ maxWidth: '400px', fontSize: '0.9rem' }}>Click "Add New Skill" above to pick a technology and generate your structured checklist.</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="empty-state">
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>No matching tasks found</h3>
          <p style={{ fontSize: '0.9rem' }}>Try clearing your search term or selecting a different filter option.</p>
        </div>
      ) : (
        <div className="skills-grid">
          {filteredSkills.map(skill => (
            <SkillCard 
              key={skill._id} 
              skill={skill} 
              onUpdate={handleUpdateSkill} 
              onDelete={handleDeleteSkill}
              onOpenDetails={setSelectedSkill}
            />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Skill Task</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Frontend, Backend, DevOps"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Task Topic</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., React Fundamentals, Node.js REST API"
                  value={newTask.task}
                  onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Skill Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Details Modal */}
      {selectedSkill && (
        <SkillDetailsModal 
          skill={selectedSkill} 
          onClose={() => setSelectedSkill(null)} 
          onSave={handleUpdateSkill} 
        />
      )}
    </div>
  );
};

export default Dashboard;
