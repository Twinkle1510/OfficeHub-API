import React, { useState, useEffect } from 'react';
import { Layers, Plus, ChevronRight, ChevronLeft, Trash2, Clock, ShieldCheck } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const ProjectKanban = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Development', priority: 'Medium', stage: 'backlog' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load project board', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!form.title) return;

    try {
      const res = await api.post('/projects', form);
      setProjects([res.data.data, ...projects]);
      setIsModalOpen(false);
      setForm({ title: '', description: '', category: 'Development', priority: 'Medium', stage: 'backlog' });
      Swal.fire('Created!', 'Project sprint card added to Backlog.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to create project card', 'error');
    }
  };

  const handleMoveStage = async (id, currentStage, direction) => {
    const stages = ['backlog', 'in-progress', 'code-review', 'completed'];
    const currentIdx = stages.indexOf(currentStage);
    const targetIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;

    if (targetIdx < 0 || targetIdx >= stages.length) return;

    const newStage = stages[targetIdx];

    try {
      const res = await api.put(`/projects/${id}`, { stage: newStage });
      setProjects(projects.map(p => p._id === id ? res.data.data : p));
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to move sprint card', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Card?',
      text: 'Remove this sprint task from Kanban board?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const stages = [
    { key: 'backlog', title: '📋 Backlog', color: 'var(--text-muted)' },
    { key: 'in-progress', title: '⚙️ In Progress', color: 'var(--primary)' },
    { key: 'code-review', title: '🔍 Code Review', color: 'var(--amber)' },
    { key: 'completed', title: '✅ Completed', color: 'var(--emerald)' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title">Sprint Kanban Board <span className="text-gradient">📌</span></h1>
          <p className="dashboard-subtitle">Agile IT project management, code review queues, and sprint tracking.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Sprint Card
        </button>
      </div>

      {/* New Project Form */}
      {isModalOpen && (
        <form onSubmit={handleCreateProject} className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border-highlight)' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--violet)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} /> Create Sprint Task Card
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Build JWT Refresh Token API"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Development">Development</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="QA & Testing">QA & Testing</option>
                <option value="Bug Fix">Bug Fix</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="form-input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical ⚠️</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Description & Requirements</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g. Add endpoint for token rotation and rate limiting"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Card</button>
          </div>
        </form>
      )}

      {/* Kanban Board 4 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {stages.map(stg => {
          const colProjects = projects.filter(p => p.stage === stg.key);
          return (
            <div key={stg.key} className="glass-panel" style={{ padding: '1.25rem', minHeight: '60vh', background: 'rgba(10, 15, 35, 0.7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: stg.color }}>{stg.title}</h3>
                <span className="skill-category-badge">{colProjects.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {colProjects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                    No tasks in {stg.key}
                  </div>
                ) : (
                  colProjects.map(proj => (
                    <div key={proj._id} style={{ background: 'rgba(20, 25, 55, 0.9)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="skill-category-badge" style={{ fontSize: '0.65rem' }}>{proj.category}</span>
                        <span style={{ 
                          fontSize: '0.65rem', fontWeight: 800, 
                          color: proj.priority === 'Critical' ? 'var(--rose)' : proj.priority === 'High' ? 'var(--amber)' : 'var(--text-muted)'
                        }}>
                          {proj.priority.toUpperCase()}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>{proj.title}</h4>
                      {proj.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{proj.description}</p>}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          👤 {proj.assignedTo?.name || 'Unassigned'}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {stg.key !== 'backlog' && (
                            <button onClick={() => handleMoveStage(proj._id, proj.stage, 'prev')} className="action-btn" title="Move Back">
                              <ChevronLeft size={16} />
                            </button>
                          )}
                          {stg.key !== 'completed' && (
                            <button onClick={() => handleMoveStage(proj._id, proj.stage, 'next')} className="action-btn" title="Move Forward">
                              <ChevronRight size={16} />
                            </button>
                          )}
                          <button onClick={() => handleDeleteProject(proj._id)} className="action-btn delete" title="Delete Card">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProjectKanban;
