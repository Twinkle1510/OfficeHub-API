import React, { useState, useEffect } from 'react';
import { Laptop, Monitor, Key, Plus, ShieldCheck, UserCheck } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Laptop', serialNumber: '', assignedUser: '', condition: 'Excellent' });

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isHRorAdmin = ['admin', 'hr', 'owner'].includes(currentUser?.role);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/assets');
      setAssets(res.data.data);

      if (isHRorAdmin) {
        const uRes = await api.get('/users');
        setUsers(uRes.data.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load assets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    if (!form.name || !form.serialNumber) {
      Swal.fire('Warning', 'Please enter Asset name and Serial Number', 'warning');
      return;
    }

    try {
      const res = await api.post('/assets', form);
      setAssets([res.data.data, ...assets]);
      setIsAdding(false);
      setForm({ name: '', category: 'Laptop', serialNumber: '', assignedUser: '', condition: 'Excellent' });
      Swal.fire('Asset Registered!', 'Hardware device registered in company inventory.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'Failed to register asset', 'error');
    }
  };

  const handleAssignAsset = async (assetId, userId) => {
    try {
      const res = await api.put(`/assets/${assetId}/assign`, { assignedUser: userId || null });
      setAssets(assets.map(a => a._id === assetId ? res.data.data : a));
      Swal.fire('Updated!', 'Equipment assignment updated successfully', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update asset assignment', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title">Office Hardware & Assets <span className="text-gradient">💻</span></h1>
          <p className="dashboard-subtitle">Track laptops, monitors, security access keys, and assigned hardware inventory.</p>
        </div>
        {isHRorAdmin && (
          <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Register New Equipment
          </button>
        )}
      </div>

      {/* HR Add Equipment Form */}
      {isAdding && (
        <form onSubmit={handleCreateAsset} className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border-highlight)' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--violet)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Laptop size={20} /> Add Hardware Device to Inventory
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Device Name</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. MacBook Pro M2 Max 16-inch"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                <option value="Laptop">Laptop / Workstation</option>
                <option value="Monitor">Dual 4K Monitor</option>
                <option value="Access Key">YubiKey / Security Card</option>
                <option value="Headset">Noise-Canceling Headset</option>
                <option value="Mobile">Test Mobile Device</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Serial Number</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. C02G4590Q65D"
                value={form.serialNumber}
                onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assign To Employee</label>
              <select 
                className="form-input"
                value={form.assignedUser}
                onChange={(e) => setForm({ ...form, assignedUser: e.target.value })}
              >
                <option value="">-- Unassigned (Inventory Stock) --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Asset</button>
          </div>
        </form>
      )}

      {/* Asset List Grid */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={22} color="var(--violet)" /> Company Hardware Registry ({assets.length})
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading assets...</p>
        ) : assets.length === 0 ? (
          <div className="empty-state">
            <Laptop size={32} style={{ color: 'var(--violet)', marginBottom: '0.75rem' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>No company assets logged</h3>
            <p style={{ fontSize: '0.875rem' }}>Register hardware devices to track employee equipment assignments.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {assets.map(ast => (
              <div key={ast._id} style={{ background: 'rgba(15, 20, 45, 0.8)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="skill-category-badge">{ast.category}</span>
                  <span className={`status-pill ${ast.status === 'Assigned' ? 'completed' : 'pending'}`}>
                    {ast.status.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{ast.name}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.85rem' }}>
                  S/N: {ast.serialNumber}
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Assigned To:</span>
                  {isHRorAdmin ? (
                    <select
                      value={ast.assignedUser?._id || ''}
                      onChange={(e) => handleAssignAsset(ast._id, e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--violet)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      <option value="">Unassigned</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{ast.assignedUser?.name || 'Stock'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AssetManagement;
