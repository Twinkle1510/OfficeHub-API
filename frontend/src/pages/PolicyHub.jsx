import React from 'react';
import { Calendar, FileText, Download, ShieldCheck, Award } from 'lucide-react';
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

  const policies = [
    { id: 1, name: 'IT Security & NDA Guidelines 2026', size: '1.4 MB', category: 'Security' },
    { id: 2, name: 'Remote Work & Hybrid WFH Policy', size: '850 KB', category: 'HR Policy' },
    { id: 3, name: 'Employee Health & Medical Insurance Handbook', size: '2.1 MB', category: 'Benefits' },
    { id: 4, name: 'Code Review & Engineering Best Practices', size: '1.1 MB', category: 'Engineering' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title">Company Policy & Holiday Hub <span className="text-gradient">📜</span></h1>
          <p className="dashboard-subtitle">Official 2026 paid holiday calendar, HR handbook, and compliance downloads.</p>
        </div>
      </div>

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
            {policies.map(p => (
              <div key={p.id} style={{ background: 'rgba(15, 20, 45, 0.7)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="skill-category-badge">{p.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.size}</span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>{p.name}</h4>

                <button onClick={() => Swal.fire({title: 'Downloading...', text: `Initiating download for ${p.name}`, icon: 'info'})} className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Download size={14} /> Download PDF Document
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PolicyHub;
