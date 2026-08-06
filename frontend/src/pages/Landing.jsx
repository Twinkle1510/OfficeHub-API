import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Code, TrendingUp, Users, Award, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 6rem 0' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '920px', margin: '0 auto 4.5rem auto' }}>
        
        {/* Animated Pill Badge */}
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
          <Sparkles size={15} /> Next-Gen Enterprise Curriculum & Analytics
        </div>

        {/* Shimmer Headline */}
        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1', letterSpacing: '-0.04em' }}>
          Master Your Stack with <br />
          <span className="text-shimmer">DevSkills Pro</span>
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '660px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
          The enterprise-grade platform for modern developers to track learning velocity, structure tech roadmaps, and benchmark progress.
        </p>

        {/* CTA Action Buttons */}
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.95rem 2.4rem', fontSize: '1.05rem', borderRadius: '14px' }}>
            Start Tracking Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.95rem 2.4rem', fontSize: '1.05rem', borderRadius: '14px' }}>
            Sign In to Workspace
          </Link>
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2.75rem', color: 'var(--text-subtle)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={16} color="var(--emerald)" /> Role-Based Security</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Zap size={16} color="var(--amber)" /> Auto-Syllabus Matching</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={16} color="var(--violet)" /> Real-Time Analytics</span>
        </div>
      </div>

      {/* Interactive Mockup Container */}
      <div style={{ maxWidth: '1050px', margin: '0 auto 6rem auto', position: 'relative' }}>
        
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          right: '5%',
          height: '70%',
          background: 'var(--gradient-glow)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          zIndex: 0,
          opacity: 0.6
        }}></div>

        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', zIndex: 1, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>devskills-workspace.live.v2</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--emerald)' }}>
              <span className="status-dot pulse" style={{ background: 'var(--emerald)' }}></span> Live System Active
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-light)', background: '#000' }}>
              <img 
                src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" 
                alt="DevSkills Matrix Engine" 
                className="gif-screen-blend" 
                style={{ width: '100%', height: '220px', objectFit: 'cover', opacity: 0.85 }} 
              />
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', background: 'rgba(7, 9, 19, 0.88)', backdropFilter: 'blur(10px)', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--violet)', fontWeight: '700' }}>⚡ Real-Time Tracking</span>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Auto-synced with team directory</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(14, 18, 38, 0.85)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Curriculum Progress</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>84%</div>
                </div>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'conic-gradient(var(--violet) 84%, rgba(255,255,255,0.08) 0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0e1226', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--violet)' }}>
                    84%
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(14, 18, 38, 0.85)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Learning Velocity</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--amber)', fontFamily: 'Outfit, sans-serif' }}>18 Days 🔥</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--emerald)', background: 'rgba(16, 185, 129, 0.12)', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  Active Leader
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Feature Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.25rem' }}>
            <Code size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Auto-Syllabus Generator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Type any tech topic to automatically generate structured sub-task learning roadmaps.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)', marginBottom: '1.25rem' }}>
            <TrendingUp size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Visual Velocity Analytics</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Monitor category breakdown and status velocity via high-contrast Recharts diagrams.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', marginBottom: '1.25rem' }}>
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Trophy Cabinet & Badges</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Unlock developer achievements and showcase your badge cabinet to recruiters.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--violet)', marginBottom: '1.25rem' }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Live Feed & Direct Hub</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Interact with peers on the live global activity feed and exchange direct encrypted messages.</p>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ marginTop: '6rem', borderTop: '1px solid var(--border-light)', paddingTop: '2.5rem', color: 'var(--text-subtle)', fontSize: '0.875rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} DevSkills Pro. Enterprise Developer Ecosystem.</p>
      </footer>

    </div>
  );
};

export default Landing;
