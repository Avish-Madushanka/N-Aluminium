// src/pages/CollectorLoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CollectorLogin.css';

const CollectorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      console.log('Login attempted with:', { email, password });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="RegCollect-container">
      <div className="RegCollect-card">
        <h2>Collector Login</h2>
        <p>Access your collector dashboard</p>

        {error && <div className="RegCollect-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="RegCollect-formGroup">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collector@example.com"
              required
              className="RegCollect-input"
            />
          </div>

          <div className="RegCollect-formGroup">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="RegCollect-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="RegCollect-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="RegCollect-footer">
          <Link to="/collector-forgot-password" className="RegCollect-link">Forgot password?</Link>
          <span>Don't have an account? <Link to="/collector-register" className="RegCollect-link">Register</Link></span>
        </div>
      </div>
    </div>
  );
};

export default CollectorLogin;