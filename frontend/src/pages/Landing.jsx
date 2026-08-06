import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Code, TrendingUp, Users, Award, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2, LayoutDashboard } from 'lucide-react';

const Landing = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 6rem 0' }}>
      
      {/* Top Navbar */}
      <nav className="navbar" style={{ position: 'relative', background: 'transparent', border: 'none', marginBottom: '2rem' }}>
        <div className="navbar-container">
          <Link to="/" className="nav-brand">
            <div className="nav-brand-badge">
              <LayoutDashboard size={22} />
            </div>
            <span>DevSkills<span className="text-gradient">.pro</span></span>
          </Link>
          
          <div className="nav-links">
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '920px', margin: '0 auto 4.5rem auto' }}>
        
        <div className="animated-float" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 1.15rem',
          borderRadius: '30px',
          background: 'rgba(168, 85, 247, 0.14)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          color: 'var(--violet)',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '2rem',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.25)'
        }}>
          <Sparkles size={15} /> Next-Gen Left-Sidebar & Bento Workspace
        </div>

        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1', letterSpacing: '-0.04em' }}>
          Master Your Stack with <br />
          <span className="text-shimmer">DevSkills Workspace</span>
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '660px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
          The enterprise-grade workspace for modern developers to track learning velocity, structure tech roadmaps, and benchmark progress.
        </p>

        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.95rem 2.4rem', fontSize: '1.05rem', borderRadius: '14px' }}>
            Start Tracking Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.95rem 2.4rem', fontSize: '1.05rem', borderRadius: '14px' }}>
            Sign In to Workspace
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2.75rem', color: 'var(--text-subtle)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={16} color="var(--emerald)" /> Role-Based Security</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Zap size={16} color="var(--amber)" /> Auto-Syllabus Generator</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={16} color="var(--violet)" /> Real-Time Feed</span>
        </div>
      </div>

      {/* Bento Showcase Section */}
      <div className="bento-grid" style={{ maxWidth: '1100px', margin: '0 auto 6rem auto' }}>
        
        {/* Main Bento Hero Card (Col 8) */}
        <div className="bento-card bento-col-8" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>devskills-bento-workspace.v3</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--emerald)' }}>
              <span className="status-dot pulse" style={{ background: 'var(--emerald)' }}></span> Live Workspace
            </div>
          </div>

          <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-light)', background: '#000' }}>
            <img 
              src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" 
              alt="Workspace Matrix Engine" 
              className="gif-screen-blend" 
              style={{ width: '100%', height: '230px', objectFit: 'cover', opacity: 0.85 }} 
            />
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', background: 'rgba(7, 9, 19, 0.88)', backdropFilter: 'blur(10px)', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--violet)', fontWeight: '700' }}>⚡ Left Sidebar Navigation + Bento Widgets</span>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Organized, clean desktop workspace design</div>
            </div>
          </div>
        </div>

        {/* Side Bento Feature Cards (Col 4) */}
        <div className="bento-col-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="bento-card">
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
              <Code size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Auto-Syllabus</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Type any tech topic to generate structured sub-task checklists.</p>
          </div>

          <div className="bento-card">
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)', marginBottom: '1rem' }}>
              <TrendingUp size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Visual Velocity</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monitor status velocity via high-contrast Recharts diagrams.</p>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer style={{ marginTop: '4rem', borderTop: '1px solid var(--border-light)', paddingTop: '2.5rem', color: 'var(--text-subtle)', fontSize: '0.875rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} DevSkills Pro. Enterprise Developer Ecosystem.</p>
      </footer>

    </div>
  );
};

export default Landing;
