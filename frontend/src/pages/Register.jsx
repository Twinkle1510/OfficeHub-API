import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, ArrowRight, UserPlus } from 'lucide-react';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      
      {/* Ambient Glow */}
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        background: 'var(--gradient-glow)',
        filter: 'blur(110px)',
        borderRadius: '50%',
        zIndex: 0,
        opacity: 0.35
      }}></div>

      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--purple)', marginBottom: '1rem'
          }}>
            <UserPlus size={24} />
          </div>
          <h1 className="auth-title">Create Workspace Account</h1>
          <p className="auth-subtitle">Join your development team on DevSkills Pro</p>
        </div>
        
        {error && <div className="error-msg">{error}</div>}
          
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
              <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                name="password"
                className="form-input" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required 
                minLength={6}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Your Role / Department</label>
            <div style={{ position: 'relative' }}>
              <select 
                name="role"
                className="form-input" 
                value={formData.role}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required
              >
                <option value="employee">Employee</option>
                <option value="developer">Developer</option>
                <option value="tester">Tester</option>
                <option value="designer">Designer</option>
                <option value="hr">HR (Human Resources)</option>
                <option value="owner">Owner / Admin</option>
              </select>
              <Briefcase size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : <>Complete Sign Up <ArrowRight size={18} /></>}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" className="auth-link">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
