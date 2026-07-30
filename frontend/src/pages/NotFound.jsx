import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <AlertTriangle size={64} color="var(--warning)" style={{ marginBottom: '2rem' }} />
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-main)' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '400px' }}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
