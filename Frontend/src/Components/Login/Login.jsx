// src/Components/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import API_ENDPOINTS from '../../apiConfig';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    setErrorMessage('');
    checkBackendStatus();
  }, []);

  const isConnectionError = (msg) =>
    /connection error|cannot reach|timed out|network error/i.test(msg);

  const checkBackendStatus = async () => {
    const backendRootUrl = API_ENDPOINTS.BACKEND_ROOT_URL || 'http://localhost:5003/';
    setServerStatus('checking');

    if (isConnectionError(errorMessage)) {
      setErrorMessage('');
    }

    try {
      await axios.get(backendRootUrl, { timeout: 5000 });
      setServerStatus('online');
      return true;
    } catch (err) {
      console.error("[Login Comp] Backend check failed:", err.message);
      setServerStatus('offline');
      if (!errorMessage || isConnectionError(errorMessage)) {
        setErrorMessage('Connection Error: Cannot reach the server. Please ensure it is running.');
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage(!email ? "Please enter your email address." : "Please enter your password.");
      return;
    }

    setIsLoading(true);

    if (serverStatus !== 'online') {
      const isOnline = await checkBackendStatus();
      if (!isOnline) {
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

      if (response.data?.success && response.data?.token && response.data?.data) {
        onLoginSuccess(response.data.token, response.data.data);
      } else {
        const errMsg = response.data?.message || 'Login failed: Unexpected response from server.';
        setErrorMessage(errMsg);
        setIsLoading(false);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleApiError = (error) => {
    setIsLoading(false);

    if (error.code === 'ECONNABORTED') {
      setErrorMessage('Login request timed out. The server might be busy or not responding.');
      setServerStatus('error');
      return;
    }

    if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message;
      switch (status) {
        case 400:
          setErrorMessage(msg || 'Invalid input. Please check your details.');
          break;
        case 401:
          setErrorMessage(msg || 'Incorrect email or password.');
          break;
        case 403:
          setErrorMessage(msg || 'Access denied with these credentials.');
          break;
        case 500:
        default:
          setErrorMessage(msg || `Login failed (Status ${status}). Please try again.`);
          if (status >= 500) setServerStatus('error');
      }
    } else if (error.request) {
      setErrorMessage('Network Error: Could not connect to the server. Check your internet connection.');
      setServerStatus('offline');
    } else {
      setErrorMessage(error.message || 'Unexpected error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="left-section">
          <h1 className="welcome-title">Welcome Back!</h1>
          <p className="subtitle">Log in to your N-Aluminium account.</p>
          <div className="collector-reg-container">
            <Link to="/collectorLogin" className="collector-reg-button">
              <button className="collector-btn">
                Register as Collector
              </button>
            </Link>
          </div>
        </div>
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>
          <div className="message-area" style={{ minHeight: '40px', marginBottom: '20px', width: '100%' }}>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={isLoading || serverStatus === 'checking'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={isLoading || serverStatus === 'checking'}
              />
            </div>
            <button
              type="submit"
              className="signin-button"
              disabled={isLoading || serverStatus === 'offline' || serverStatus === 'checking'}
            >
              {isLoading ? 'Signing in...' : serverStatus === 'checking' ? 'Connecting...' : 'Sign in now'}
            </button>
          </form>
          <div className="signup-link-container" style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em' }}>
            Don't have an account? <Link to="/SignUp" className="signup-link">Sign Up Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;