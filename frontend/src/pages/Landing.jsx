import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Code, TrendingUp, Users, Award } from 'lucide-react';

const Landing = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 0' }}>
      
      {/* Hero Section */}
      <div style={{ marginBottom: '6rem', maxWidth: '800px', margin: '0 auto 6rem auto' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Master Your Stack with <br/>
          <span style={{ 
            background: 'linear-gradient(to right, var(--primary), #a5b4fc)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>DevSkills Tracker</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          The ultimate platform for developers to track learning progress, follow structured curriculums, and compete with a global community.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Started for Free
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Login to Account
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <Code size={36} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Auto-Syllabus</h3>
          <p style={{ color: 'var(--text-muted)' }}>Stop guessing what to learn. Pick a stack and we generate the perfect checklist for you.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <TrendingUp size={36} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Visual Progress</h3>
          <p style={{ color: 'var(--text-muted)' }}>See your growth through beautiful charts and dynamic progress tracking cards.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <Award size={36} color="#fbbf24" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Gamification</h3>
          <p style={{ color: 'var(--text-muted)' }}>Earn badges and achievements as you complete tasks. Build your developer trophy cabinet.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <Users size={36} color="#ec4899" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Global Community</h3>
          <p style={{ color: 'var(--text-muted)' }}>See what others are learning in the Live Feed and climb the global Leaderboard.</p>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ marginTop: '6rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} DevSkills Tracker. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Landing;
