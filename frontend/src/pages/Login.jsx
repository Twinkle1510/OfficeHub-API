import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import api from '../api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillDemo = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'var(--gradient-glow)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0,
        opacity: 0.4
      }}></div>

      <div className="auth-card" style={{ maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)', marginBottom: '1rem'
          }}>
            <Shield size={24} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your DevSkills workspace</p>
        </div>
        
        {error && <div className="error-msg">{error}</div>}

        {/* Demo Quick Fill Buttons */}
        <div style={{
          background: 'rgba(15, 20, 45, 0.8)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--violet)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={14} /> 1-CLICK DEMO ACCOUNTS
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillDemo('admin@devskills.com', 'admin123')}
              style={{
                flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'var(--primary)', borderRadius: '8px', cursor: 'pointer'
              }}
            >
              👑 Admin
            </button>

            <button
              type="button"
              onClick={() => fillDemo('hr@devskills.com', 'hr123456')}
              style={{
                flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)',
                color: 'var(--violet)', borderRadius: '8px', cursor: 'pointer'
              }}
            >
              👔 HR
            </button>

            <button
              type="button"
              onClick={() => fillDemo('alex@devskills.com', 'employee123')}
              style={{
                flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--emerald)', borderRadius: '8px', cursor: 'pointer'
              }}
            >
              💻 Employee
            </button>
          </div>
        </div>
          
        <form onSubmit={handleSubmit}>
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
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" className="auth-link">Create workspace account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
