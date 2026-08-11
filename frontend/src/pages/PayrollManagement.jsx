import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, Download, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const PayrollManagement = () => {
  const [slips, setSlips] = useState([]);
  const [allPayrolls, setAllPayrolls] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState({ userId: '', month: '2026-08', baseSalary: '', bonuses: '0', deductions: '0' });

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isHRorAdmin = ['admin', 'hr', 'owner'].includes(currentUser?.role);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const myRes = await api.get('/payroll/my-slips');
      setSlips(myRes.data.data);

      if (isHRorAdmin) {
        const [allRes, userRes] = await Promise.all([
          api.get('/payroll/all'),
          api.get('/users')
        ]);
        setAllPayrolls(allRes.data.data);
        setUsers(userRes.data.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load payroll data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.month || !form.baseSalary) {
      Swal.fire('Warning', 'Please select user, month, and base salary', 'warning');
      return;
    }

    try {
      const res = await api.post('/payroll/generate', {
        ...form,
        baseSalary: Number(form.baseSalary),
        bonuses: Number(form.bonuses),
        deductions: Number(form.deductions)
      });

      setAllPayrolls([res.data.data, ...allPayrolls]);
      setIsGenerating(false);
      setForm({ userId: '', month: '2026-08', baseSalary: '', bonuses: '0', deductions: '0' });
      Swal.fire('Payroll Processed!', `Net Salary: $${res.data.data.netSalary} (Includes Overtime calculations)`, 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'Failed to process payroll', 'error');
    }
  };

  const exportToCSV = () => {
    if (allPayrolls.length === 0) return;
    const headers = ['Employee,Month,Base Salary,Overtime Pay,Bonuses,Deductions,Net Salary\n'];
    const csv = allPayrolls.map(p => {
      const emp = p.user?.name || 'Unknown';
      return `${emp},${p.month},${p.baseSalary},${p.overtimePay},${p.bonuses},${p.deductions},${p.netSalary}`;
    });
    
    const blob = new Blob([headers + csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_master_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title">Payroll & Salary Slips <span className="text-gradient">💳</span></h1>
          <p className="dashboard-subtitle">Manage employee base salaries, overtime bonuses, tax deductions, and paystubs.</p>
        </div>
        {isHRorAdmin && (
          <button 
            className="btn btn-primary" 
            onClick={() => setIsGenerating(!isGenerating)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> {isGenerating ? 'Cancel' : 'Generate Monthly Payroll'}
          </button>
        )}
      </div>

      {/* HR Generate Payroll Form */}
      {isGenerating && (
        <form onSubmit={handleGeneratePayroll} className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border-highlight)' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--violet)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} /> Process Monthly Employee Paystub
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Select Employee</label>
              <select 
                className="form-input"
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                required
              >
                <option value="">-- Choose Employee --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Pay Month</label>
              <input 
                type="month" 
                className="form-input"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Base Salary ($)</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="e.g. 5000"
                value={form.baseSalary}
                onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Performance Bonus ($)</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="0"
                value={form.bonuses}
                onChange={(e) => setForm({ ...form, bonuses: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deductions / Tax ($)</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="0"
                value={form.deductions}
                onChange={(e) => setForm({ ...form, deductions: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsGenerating(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Process Paystub</button>
          </div>
        </form>
      )}

      {/* HR All Payroll Records Queue */}
      {isHRorAdmin && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={22} color="var(--violet)" /> Company Payroll Master Log ({allPayrolls.length})
            </h2>
            <button onClick={exportToCSV} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <Download size={16} /> Export CSV
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading payrolls...</p>
          ) : allPayrolls.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No payroll records processed yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.85rem 0' }}>Employee</th>
                    <th style={{ padding: '0.85rem 0' }}>Month</th>
                    <th style={{ padding: '0.85rem 0' }}>Base Salary</th>
                    <th style={{ padding: '0.85rem 0' }}>Overtime Pay</th>
                    <th style={{ padding: '0.85rem 0' }}>Bonuses</th>
                    <th style={{ padding: '0.85rem 0' }}>Net Payable</th>
                    <th style={{ padding: '0.85rem 0' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayrolls.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.9rem 0', fontWeight: 600 }}>{p.user?.name || 'Employee'}</td>
                      <td style={{ padding: '0.9rem 0', color: 'var(--primary)', fontWeight: 700 }}>{p.month}</td>
                      <td style={{ padding: '0.9rem 0' }}>${p.baseSalary}</td>
                      <td style={{ padding: '0.9rem 0', color: 'var(--amber)' }}>+${p.overtimePay}</td>
                      <td style={{ padding: '0.9rem 0', color: 'var(--emerald)' }}>+${p.bonuses}</td>
                      <td style={{ padding: '0.9rem 0', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>${p.netSalary}</td>
                      <td style={{ padding: '0.9rem 0' }}>
                        <span className="status-pill completed">PAID</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* My Salary Slips Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={22} color="var(--emerald)" /> My Paystubs & Salary History ({slips.length})
        </h2>

        {slips.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={32} style={{ color: 'var(--emerald)', marginBottom: '0.75rem' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.25rem', fontSize: '1.1rem' }}>No salary slips generated yet</h3>
            <p style={{ fontSize: '0.875rem' }}>HR will publish your monthly paystubs here after payroll calculation.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {slips.map(s => (
              <div key={s._id} style={{ background: 'rgba(15, 20, 45, 0.8)', border: '1px solid var(--border-highlight)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PAY PERIOD</span>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>{s.month}</h3>
                  </div>
                  <span className="status-pill completed">PROCESSED</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Salary:</span>
                    <span>${s.baseSalary}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--amber)' }}>
                    <span>Overtime Pay:</span>
                    <span>+${s.overtimePay}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald)' }}>
                    <span>Bonus:</span>
                    <span>+${s.bonuses}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--rose)' }}>
                    <span>Deductions:</span>
                    <span>-${s.deductions}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem', marginTop: '0.4rem', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                    <span>Net Paid:</span>
                    <span style={{ color: 'var(--emerald)' }}>${s.netSalary}</span>
                  </div>
                </div>

                <button 
                  onClick={() => window.print()} 
                  className="btn btn-outline" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                >
                  <Download size={14} /> Download Paystub PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default PayrollManagement;
