import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Download, ShieldCheck, Award, Plus, Link as LinkIcon } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const PolicyHub = () => {
  const holidays = [
    { date: 'Jan 01, 2026', day: 'Thursday', title: 'New Year\'s Day' },
    { date: 'Jan 26, 2026', day: 'Monday', title: 'Republic Day' },
    { date: 'Mar 25, 2026', day: 'Wednesday', title: 'Holi Festival' },
    { date: 'Aug 15, 2026', day: 'Saturday', title: 'Independence Day' },
    { date: 'Oct 02, 2026', day: 'Friday', title: 'Gandhi Jayanti' },
    { date: 'Nov 08, 2026', day: 'Sunday', title: 'Diwali Festival' },
    { date: 'Dec 25, 2026', day: 'Friday', title: 'Christmas Day' }
  ];

  const [policies, setPolicies] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', link: '' });

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isHRorAdmin = ['admin', 'hr', 'owner'].includes(currentUser?.role);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await api.get('/policies');
      setPolicies(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/policies', form);
      setPolicies([res.data.data, ...policies]);
      setIsAdding(false);
      setForm({ title: '', category: '', link: '' });
      Swal.fire('Success', 'Policy added successfully', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Failed to add policy', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="dashboard-title">Company Policy & Holiday Hub <span className="text-gradient">📜</span></h1>
            <p className="dashboard-subtitle">Official 2026 paid holiday calendar, HR handbook, and compliance downloads.</p>
          </div>
          {isHRorAdmin && (
            <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> {isAdding ? 'Cancel' : 'Add Policy'}
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddPolicy} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-highlight)' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--violet)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} /> Add New Policy Document
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Document Title</label>
              <input type="text" className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input type="text" className="form-input" placeholder="e.g. HR, Security" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">External Link (Drive/PDF URL)</label>
              <input type="url" className="form-input" required value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Policy</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Paid Holiday Calendar 2026 */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--violet)' }}>
            <Calendar size={22} /> Official Paid Holiday Calendar (2026)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {holidays.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 20, 45, 0.7)', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{h.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.day}</div>
                </div>
                <span className="skill-category-badge" style={{ color: 'var(--emerald)', background: 'rgba(16, 185, 129, 0.15)' }}>{h.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Company Compliance Documents & Handbooks */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <FileText size={22} /> HR Handbooks & Compliance Documents
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {policies.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No policies available yet.</p>
            ) : (
              policies.map(p => (
                <div key={p._id} style={{ background: 'rgba(15, 20, 45, 0.7)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="skill-category-badge">{p.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.size || 'External Link'}</span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>{p.title}</h4>

                  <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                      <LinkIcon size={14} /> Open Document
                    </button>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PolicyHub;
