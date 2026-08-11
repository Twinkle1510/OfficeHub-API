import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { 
  Shield, Trash2, Users, Eye, X, Plus, Calendar, MessageSquare, 
  Send, BarChart2, DollarSign, Laptop, Megaphone, ShieldCheck, CheckCircle2, Clock, Zap, FileText 
} from 'lucide-react';
import { syllabusData } from '../data/syllabus';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'payroll' | 'leaves' | 'assets' | 'announcements'
  
  // Data States with Instant Local Cache
  const [users, setUsers] = useState(() => JSON.parse(sessionStorage.getItem('admin_users') || '[]'));
  const [payrolls, setPayrolls] = useState(() => JSON.parse(sessionStorage.getItem('admin_payrolls') || '[]'));
  const [leaves, setLeaves] = useState(() => JSON.parse(sessionStorage.getItem('admin_leaves') || '[]'));
  const [assets, setAssets] = useState(() => JSON.parse(sessionStorage.getItem('admin_assets') || '[]'));
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('admin_users'));

  // User Progress Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [taskMode, setTaskMode] = useState('syllabus');
  const [newTask, setNewTask] = useState({ category: '', task: '', subTasks: [], targetDate: '' });

  // Global Assign Task Modal
  const [isGlobalAssignOpen, setIsGlobalAssignOpen] = useState(false);
  const [globalTaskMode, setGlobalTaskMode] = useState('syllabus');
  const [globalNewTask, setGlobalNewTask] = useState({ userId: '', category: '', task: '', subTasks: [], targetDate: '' });

  // Task Messaging State
  const [selectedTaskForMessages, setSelectedTaskForMessages] = useState(null);
  const [taskMessages, setTaskMessages] = useState([]);
  const [newAdminMessage, setNewAdminMessage] = useState('');

  // Payroll Form State
  const [payrollForm, setPayrollForm] = useState({ userId: '', month: '2026-08', baseSalary: '', bonuses: '0', deductions: '0' });

  // Asset Form State
  const [assetForm, setAssetForm] = useState({ name: '', category: 'Laptop', serialNumber: '', assignedUser: '' });

  // Announcement State
  const [announcements, setAnnouncements] = useState([
    { id: 1, author: 'HR Department', text: '📢 Q3 Sprint Review is scheduled for next Monday. Ensure all task cards are updated in Kanban.', time: 'Today' }
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // Graph Data
  const [monthlyGraphData, setMonthlyGraphData] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAllMasterData();
  }, []);

  const fetchAllMasterData = async () => {
    try {
      const [uRes, pRes, lRes, aRes] = await Promise.all([
        api.get('/users').catch(() => ({ data: { data: [] } })),
        api.get('/payroll/all').catch(() => ({ data: { data: [] } })),
        api.get('/leave/all').catch(() => ({ data: { data: [] } })),
        api.get('/assets').catch(() => ({ data: { data: [] } }))
      ]);

      const fetchedUsers = Array.isArray(uRes.data?.data) ? uRes.data.data : [];
      const fetchedPayrolls = Array.isArray(pRes.data?.data) ? pRes.data.data : [];
      const fetchedLeaves = Array.isArray(lRes.data?.data) ? lRes.data.data : [];
      const fetchedAssets = Array.isArray(aRes.data?.data) ? aRes.data.data : [];

      setUsers(fetchedUsers);
      setPayrolls(fetchedPayrolls);
      setLeaves(fetchedLeaves);
      setAssets(fetchedAssets);

      // Save to sessionStorage for 0ms instant next load
      sessionStorage.setItem('admin_users', JSON.stringify(fetchedUsers));
      sessionStorage.setItem('admin_payrolls', JSON.stringify(fetchedPayrolls));
      sessionStorage.setItem('admin_leaves', JSON.stringify(fetchedLeaves));
      sessionStorage.setItem('admin_assets', JSON.stringify(fetchedAssets));
    } catch (err) {
      console.error('Failed to load admin master data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: res.data.data.role } : u));
      Swal.fire('Updated!', `User role changed to ${newRole.toUpperCase()}`, 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'Failed to update role', 'error');
    }
  };

  const handleDeleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete User Account?',
      text: `Are you sure you want to delete ${name}? This action is irreversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete Account'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        if (selectedUser && selectedUser._id === id) setSelectedUser(null);
        Swal.fire('Deleted!', 'User has been deleted from company database.', 'success');
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
      const skills = Array.isArray(res.data?.data) ? res.data.data : [];
      setUserSkills(skills);

      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      const days = eachDayOfInterval({ start, end });

      const graphData = days.map(day => {
        const completedOnDay = skills.filter(s => s.status === 'completed' && s.completedAt && isSameDay(parseISO(s.completedAt), day)).length;
        const assignedOnDay = skills.filter(s => s.createdAt && isSameDay(parseISO(s.createdAt), day)).length;
        return { date: format(day, 'MMM dd'), completed: completedOnDay, assigned: assignedOnDay };
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
      setTaskMessages(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAdminMessage = async () => {
    if (!newAdminMessage.trim() || !selectedTaskForMessages) return;
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
      title: 'Delete Task?',
      text: 'Remove task from user roadmap?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${selectedUser._id}/skills/${skillId}`);
        setUserSkills(userSkills.filter(s => s._id !== skillId));
        Swal.fire('Deleted!', 'Task deleted.', 'success');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleGlobalAssignTask = async (e) => {
    e.preventDefault();
    if (!globalNewTask.userId || !globalNewTask.task) {
      Swal.fire('Warning', 'Please select a user and task description.', 'warning');
      return;
    }

    try {
      await api.post(`/users/${globalNewTask.userId}/skills`, globalNewTask);
      setIsGlobalAssignOpen(false);
      setGlobalNewTask({ userId: '', category: '', task: '', subTasks: [], targetDate: '' });
      Swal.fire('Success', 'Task assigned to user roadmap!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to assign task', 'error');
    }
  };

  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    if (!payrollForm.userId || !payrollForm.baseSalary) return;

    try {
      const res = await api.post('/payroll/generate', {
        ...payrollForm,
        baseSalary: Number(payrollForm.baseSalary),
        bonuses: Number(payrollForm.bonuses),
        deductions: Number(payrollForm.deductions)
      });
      setPayrolls([res.data.data, ...payrolls]);
      setPayrollForm({ userId: '', month: '2026-08', baseSalary: '', bonuses: '0', deductions: '0' });
      Swal.fire('Payroll Processed!', `Net Salary: ${res.data.data.netSalary}`, 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to process payroll', 'error');
    }
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      const res = await api.put(`/leave/${id}/status`, { status });
      setLeaves(leaves.map(l => l._id === id ? res.data.data : l));
      Swal.fire('Updated!', `Leave request set to ${status.toUpperCase()}`, 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update leave', 'error');
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    if (!assetForm.name || !assetForm.serialNumber) return;

    try {
      const res = await api.post('/assets', assetForm);
      setAssets([res.data.data, ...assets]);
      setAssetForm({ name: '', category: 'Laptop', serialNumber: '', assignedUser: '' });
      Swal.fire('Registered!', 'Hardware device registered.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to register asset', 'error');
    }
  };

  const handleAssignAsset = async (assetId, userId) => {
    try {
      const res = await api.put(`/assets/${assetId}/assign`, { assignedUser: userId || null });
      setAssets(assets.map(a => a._id === assetId ? res.data.data : a));
      Swal.fire('Updated!', 'Equipment assignment updated.', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    const ann = { id: Date.now(), author: currentUser.name, text: newAnnouncement, time: 'Just now' };
    setAnnouncements([ann, ...announcements]);
    setNewAnnouncement('');
    Swal.fire('Broadcast Published!', 'Announcement published to all employees.', 'success');
  };

  if (!currentUser || !['admin', 'hr', 'owner'].includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const totalPayrollDisbursed = payrolls.reduce((acc, p) => acc + (p.netSalary || 0), 0);
  const pendingLeavesCount = leaves.filter(l => l.status === 'pending').length;
  const assignedAssetsCount = assets.filter(a => a.status === 'Assigned').length;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1140px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="dashboard-header" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield color="var(--primary)" size={32} />
            Executive Admin Control Hub <span className="text-gradient">👑</span>
          </h1>
          <p className="dashboard-subtitle">Master company command center for workforce, payroll, hardware assets, and HR operations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsGlobalAssignOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Assign Skill Task
        </button>
      </div>

      {/* KPI Cards Header Summary */}
      <div className="bento-grid" style={{ marginBottom: '2rem' }}>
        <div className="bento-card bento-col-3" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{users.length}</div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Workforce Count</div>
          </div>
        </div>

        <div className="bento-card bento-col-3" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalPayrollDisbursed.toLocaleString()}</div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Payroll Disbursed</div>
          </div>
        </div>

        <div className="bento-card bento-col-3" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Laptop size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{assignedAssetsCount}/{assets.length}</div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Hardware Allocated</div>
          </div>
        </div>

        <div className="bento-card bento-col-3" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingLeavesCount}</div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Pending Leave Requests</div>
          </div>
        </div>
      </div>

      {/* Admin Command Suite Tab Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('directory')} className={`btn ${activeTab === 'directory' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.875rem' }}>
          👥 Employee Directory ({users.length})
        </button>
        <button onClick={() => setActiveTab('payroll')} className={`btn ${activeTab === 'payroll' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.875rem' }}>
          💳 Master Payroll ({payrolls.length})
        </button>
        <button onClick={() => setActiveTab('leaves')} className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.875rem' }}>
          🌴 Leave Approvals ({pendingLeavesCount} Pending)
        </button>
        <button onClick={() => setActiveTab('assets')} className={`btn ${activeTab === 'assets' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.875rem' }}>
          💻 Hardware Assets ({assets.length})
        </button>
        <button onClick={() => setActiveTab('announcements')} className={`btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.875rem' }}>
          📢 Broadcast Notices
        </button>
      </div>

      {/* Tab 1: Employee Directory */}
      {activeTab === 'directory' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--primary)" /> Employee Directory & Role Permissions
          </h2>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading directory...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '1rem 0' }}>Name</th>
                    <th style={{ padding: '1rem 0' }}>Email</th>
                    <th style={{ padding: '1rem 0' }}>Role Permission</th>
                    <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 600 }}>{u.name} {u._id === currentUser.id && '(You)'}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === currentUser.id}
                          style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            color: ['admin', 'hr', 'owner'].includes(u.role) ? 'var(--violet)' : 'var(--text-main)',
                            border: '1px solid var(--border-light)',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: u._id === currentUser.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="employee">EMPLOYEE</option>
                          <option value="developer">DEVELOPER</option>
                          <option value="tester">TESTER</option>
                          <option value="designer">DESIGNER</option>
                          <option value="hr">HR</option>
                          <option value="admin">ADMIN</option>
                          <option value="owner">OWNER</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                        <button onClick={() => openUserProgress(u)} className="action-btn" title="View Progress" style={{ marginRight: '0.5rem' }}>
                          <Eye size={16} /> View Tasks
                        </button>
                        {u._id !== currentUser.id && (
                          <button onClick={() => handleDeleteUser(u._id, u.name)} className="action-btn delete" title="Delete User">
                            <Trash2 size={16} />
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
      )}

      {/* Tab 2: Master Payroll */}
      {activeTab === 'payroll' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} color="var(--emerald)" /> Master Company Payroll
          </h2>

          <form onSubmit={handleGeneratePayroll} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--violet)' }}>Process Employee Monthly Salary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <select className="form-input" value={payrollForm.userId} onChange={(e) => setPayrollForm({ ...payrollForm, userId: e.target.value })} required>
                <option value="">Select Employee</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
              </select>
              <input type="month" className="form-input" value={payrollForm.month} onChange={(e) => setPayrollForm({ ...payrollForm, month: e.target.value })} required />
              <input type="number" className="form-input" placeholder="Base Salary ($)" value={payrollForm.baseSalary} onChange={(e) => setPayrollForm({ ...payrollForm, baseSalary: e.target.value })} required />
              <input type="number" className="form-input" placeholder="Bonus ($)" value={payrollForm.bonuses} onChange={(e) => setPayrollForm({ ...payrollForm, bonuses: e.target.value })} />
              <input type="number" className="form-input" placeholder="Deduction ($)" value={payrollForm.deductions} onChange={(e) => setPayrollForm({ ...payrollForm, deductions: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Process Salary</button>
          </form>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 0' }}>Employee</th>
                  <th style={{ padding: '0.75rem 0' }}>Month</th>
                  <th style={{ padding: '0.75rem 0' }}>Base Salary</th>
                  <th style={{ padding: '0.75rem 0' }}>Overtime Pay</th>
                  <th style={{ padding: '0.75rem 0' }}>Net Payable</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{p.user?.name || 'Employee'}</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--primary)' }}>{p.month}</td>
                    <td style={{ padding: '0.75rem 0' }}>${p.baseSalary}</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--amber)' }}>+${p.overtimePay}</td>
                    <td style={{ padding: '0.75rem 0', fontWeight: 800, color: 'var(--emerald)' }}>${p.netSalary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: HR Leave Queue */}
      {activeTab === 'leaves' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--violet)" /> HR Leave Approvals
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 0' }}>Employee</th>
                  <th style={{ padding: '0.75rem 0' }}>Type</th>
                  <th style={{ padding: '0.75rem 0' }}>Dates</th>
                  <th style={{ padding: '0.75rem 0' }}>Reason</th>
                  <th style={{ padding: '0.75rem 0' }}>Status</th>
                  <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{l.user?.name || 'Employee'}</td>
                    <td style={{ padding: '0.75rem 0' }}><span className="skill-category-badge">{l.type}</span></td>
                    <td style={{ padding: '0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem 0', fontSize: '0.85rem' }}>{l.reason}</td>
                    <td style={{ padding: '0.75rem 0' }}><span className={`status-pill ${l.status === 'approved' ? 'completed' : l.status === 'pending' ? 'in-progress' : 'pending'}`}>{l.status.toUpperCase()}</span></td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                      {l.status === 'pending' && (
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button onClick={() => handleUpdateLeaveStatus(l._id, 'approved')} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Approve</button>
                          <button onClick={() => handleUpdateLeaveStatus(l._id, 'rejected')} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Hardware Assets */}
      {activeTab === 'assets' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Laptop size={20} color="var(--violet)" /> Hardware Assets Registry
          </h2>

          <form onSubmit={handleCreateAsset} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--violet)' }}>Register New Hardware Equipment</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <input type="text" className="form-input" placeholder="Device Name (e.g. MacBook Pro M2)" value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} required />
              <select className="form-input" value={assetForm.category} onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}>
                <option value="Laptop">Laptop / Workstation</option>
                <option value="Monitor">4K Monitor</option>
                <option value="Access Key">YubiKey Access Card</option>
                <option value="Headset">ANC Headset</option>
              </select>
              <input type="text" className="form-input" placeholder="Serial Number" value={assetForm.serialNumber} onChange={(e) => setAssetForm({ ...assetForm, serialNumber: e.target.value })} required />
              <select className="form-input" value={assetForm.assignedUser} onChange={(e) => setAssetForm({ ...assetForm, assignedUser: e.target.value })}>
                <option value="">-- Unassigned --</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Register Device</button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {assets.map(ast => (
              <div key={ast._id} style={{ background: 'rgba(15, 20, 45, 0.8)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="skill-category-badge">{ast.category}</span>
                  <span className={`status-pill ${ast.status === 'Assigned' ? 'completed' : 'pending'}`}>{ast.status.toUpperCase()}</span>
                </div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{ast.name}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.75rem' }}>S/N: {ast.serialNumber}</div>
                <select value={ast.assignedUser?._id || ''} onChange={(e) => handleAssignAsset(ast._id, e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', color: 'var(--violet)', border: '1px solid var(--border-light)', padding: '0.3rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Broadcast Notices */}
      {activeTab === 'announcements' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={20} color="var(--primary)" /> Company Broadcast Notices
          </h2>

          <form onSubmit={handlePostAnnouncement} style={{ marginBottom: '2rem' }}>
            <textarea className="form-input" rows={3} placeholder="Write company-wide notice..." value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} required style={{ marginBottom: '1rem', resize: 'none' }} />
            <button type="submit" className="btn btn-primary">Publish Announcement</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map(ann => (
              <div key={ann.id} style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '1rem 1.25rem', borderRadius: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{ann.author} • <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{ann.time}</span></div>
                <p style={{ margin: 0, fontSize: '0.925rem' }}>{ann.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Progress Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedUser.name}'s Progress & Tasks</h2>
              <button className="close-btn" onClick={() => setSelectedUser(null)}><X size={24} /></button>
            </div>

            {loadingSkills ? <p style={{ color: 'var(--text-muted)' }}>Loading tasks...</p> : (
              <>
                <div style={{ width: '100%', height: 200, margin: '1rem 0' }}>
                  <ResponsiveContainer>
                    <BarChart data={monthlyGraphData}>
                      <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)' }} />
                      <Bar dataKey="completed" fill="var(--success)" radius={[4,4,0,0]} name="Completed" />
                      <Bar dataKey="assigned" fill="var(--primary)" radius={[4,4,0,0]} name="Assigned" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {userSkills.map(skill => (
                    <div key={skill._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{skill.task}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{skill.category}</span>
                      </div>
                      <button onClick={() => handleDeleteSkill(skill._id)} className="action-btn delete"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
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
              <h2 className="modal-title">Assign Skill Task to Employee</h2>
              <button className="close-btn" onClick={() => setIsGlobalAssignOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleGlobalAssignTask} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Employee</label>
                <select className="form-input" value={globalNewTask.userId} onChange={(e) => setGlobalNewTask({ ...globalNewTask, userId: e.target.value })} required>
                  <option value="">-- Choose User --</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" className="form-input" placeholder="e.g. Backend" value={globalNewTask.category} onChange={(e) => setGlobalNewTask({ ...globalNewTask, category: e.target.value })} required />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Task Description</label>
                <input type="text" className="form-input" placeholder="e.g. Learn Redis Caching Architecture" value={globalNewTask.task} onChange={(e) => setGlobalNewTask({ ...globalNewTask, task: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
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
