import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Plus, ShieldCheck, Download } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const LeaveManagement = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Casual', startDate: '', endDate: '', reason: '' });
  
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isHRorAdmin = ['admin', 'hr', 'owner'].includes(currentUser?.role);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const myRes = await api.get('/leave/my-requests');
      setMyRequests(myRes.data.data);

      if (isHRorAdmin) {
        const allRes = await api.get('/leave/all');
        setAllRequests(allRes.data.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch leave requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      Swal.fire('Warning', 'Please fill in all leave fields.', 'warning');
      return;
    }

    try {
      const res = await api.post('/leave/apply', leaveForm);
      setMyRequests([res.data.data, ...myRequests]);
      setIsApplying(false);
      setLeaveForm({ type: 'Casual', startDate: '', endDate: '', reason: '' });
      Swal.fire('Submitted!', 'Your leave request has been sent to HR for approval.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'Failed to submit leave request', 'error');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const { value: hrNote } = await Swal.fire({
      title: `${status === 'approved' ? 'Approve' : 'Reject'} Leave Request?`,
      input: 'text',
      inputLabel: 'Add HR Note / Reason (Optional)',
      inputPlaceholder: 'e.g. Approved. Enjoy your leave!',
      showCancelButton: true,
      confirmButtonColor: status === 'approved' ? '#10b981' : '#f43f5e',
      confirmButtonText: status === 'approved' ? 'Approve Leave' : 'Reject Leave'
    });

    try {
      const res = await api.put(`/leave/${id}/status`, { status, hrNote });
      setAllRequests(allRequests.map(r => r._id === id ? res.data.data : r));
      Swal.fire('Updated!', `Leave request set to ${status.toUpperCase()}`, 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update leave status', 'error');
    }
  };

  const exportToCSV = () => {
    if (allRequests.length === 0) return;
    const headers = ['Employee,Type,Start Date,End Date,Reason,Status,HR Note\n'];
    const csv = allRequests.map(r => {
      const emp = r.user?.name || 'Unknown';
      const sd = new Date(r.startDate).toLocaleDateString();
      const ed = new Date(r.endDate).toLocaleDateString();
      const note = r.hrNote ? r.hrNote.replace(/,/g, '') : '';
      return `${emp},${r.type},${sd},${ed},${r.reason.replace(/,/g, '')},${r.status},${note}`;
    });
    
    const blob = new Blob([headers + csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave_requests_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title">Leave Management System <span className="text-gradient">🌴</span></h1>
          <p className="dashboard-subtitle">Apply for time off, check leave approval status, and manage HR queues.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsApplying(!isApplying)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> {isApplying ? 'Cancel Application' : 'Apply for Leave'}
        </button>
      </div>

      {/* Leave Application Form */}
      {isApplying && (
        <form onSubmit={handleApplyLeave} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-highlight)' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--violet)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} /> Submit Leave Request
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select 
                className="form-input" 
                value={leaveForm.type}
                onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
              >
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Paid">Paid Annual Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input 
                type="date" 
                className="form-input"
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input 
                type="date" 
                className="form-input"
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Reason for Leave</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., Family event, medical appointment, vacation..."
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsApplying(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit to HR</button>
          </div>
        </form>
      )}

      {/* HR Approval Queue Section (for HR & Admins) */}
      {isHRorAdmin && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={22} color="var(--violet)" /> HR Leave Approval Queue ({allRequests.filter(r => r.status === 'pending').length} Pending)
            </h2>
            <button onClick={exportToCSV} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <Download size={16} /> Export CSV
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading requests...</p>
          ) : allRequests.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-muted)' }}>No employee leave applications submitted yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.85rem 0' }}>Employee</th>
                    <th style={{ padding: '0.85rem 0' }}>Type</th>
                    <th style={{ padding: '0.85rem 0' }}>Dates</th>
                    <th style={{ padding: '0.85rem 0' }}>Reason</th>
                    <th style={{ padding: '0.85rem 0' }}>Status</th>
                    <th style={{ padding: '0.85rem 0', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allRequests.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.9rem 0', fontWeight: 600 }}>{r.user?.name || 'Employee'}</td>
                      <td style={{ padding: '0.9rem 0' }}><span className="skill-category-badge">{r.type}</span></td>
                      <td style={{ padding: '0.9rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.9rem 0', fontSize: '0.9rem' }}>{r.reason}</td>
                      <td style={{ padding: '0.9rem 0' }}>
                        <span className={`status-pill ${r.status === 'approved' ? 'completed' : r.status === 'pending' ? 'in-progress' : 'pending'}`}>
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 0', textAlign: 'right' }}>
                        {r.status === 'pending' ? (
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button onClick={() => handleUpdateStatus(r._id, 'approved')} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}>
                              Approve
                            </button>
                            <button onClick={() => handleUpdateStatus(r._id, 'rejected')} className="btn btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* My Leave Requests Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={22} color="var(--primary)" /> My Leave History ({myRequests.length})
        </h2>

        {myRequests.length === 0 ? (
          <div className="empty-state">
            <Calendar size={32} style={{ marginBottom: '0.75rem', color: 'var(--violet)' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.25rem', fontSize: '1.1rem' }}>No leave requests submitted</h3>
            <p style={{ fontSize: '0.875rem' }}>Click "Apply for Leave" to request time off from HR.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {myRequests.map(req => (
              <div key={req._id} style={{ background: 'rgba(15, 20, 45, 0.7)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="skill-category-badge">{req.type}</span>
                  <span className={`status-pill ${req.status === 'approved' ? 'completed' : req.status === 'pending' ? 'in-progress' : 'pending'}`}>
                    {req.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  📅 {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{req.reason}</p>

                {req.hrNote && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '0.5rem 0.75rem', borderRadius: '8px', color: 'var(--violet)' }}>
                    <strong>HR Note:</strong> {req.hrNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default LeaveManagement;
