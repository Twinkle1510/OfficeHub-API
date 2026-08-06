import React, { useState, useEffect } from 'react';
import { Plus, X, BarChart2 } from 'lucide-react';
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
  
  // Restored states
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  // Restored useEffect
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

    // Smart matching: Check if typed task matches any in our syllabus
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

  // Analytics computations
  const statusStats = [
    { name: 'Pending', count: skills.filter(s => s.status === 'pending').length },
    { name: 'In Progress', count: skills.filter(s => s.status === 'in-progress').length },
    { name: 'Completed', count: skills.filter(s => s.status === 'completed').length }
  ];

  const categoryMap = {};
  skills.forEach(s => {
    categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
  });
  const categoryStats = Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] }));
  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Learning Journey</h1>
          <p className="dashboard-subtitle">Track your progress across the stack.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Task
        </button>
      </div>

      {/* Analytics Section */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 className="text-primary" /> Progress Analytics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', height: '300px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Status Overview</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="glass-panel" style={{ padding: '1.5rem', height: '300px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Skill Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '-20px' }}>
                {categoryStats.map((entry, index) => (
                  <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search topics..." 
          className="form-input" 
          style={{ maxWidth: '300px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px' }}>
          {['All', 'Not Started', 'In Progress', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--primary)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading your skills...</p>
      ) : skills.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>No skills tracked yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Click the button above to start building your curriculum.</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>No matching tasks</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
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
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Skill Task</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddTask}>
              <div className="form-group">
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
              <div className="form-group">
                <label className="form-label">Task Description</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., JavaScript Fundamentals"
                  value={newTask.task}
                  onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Task
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
