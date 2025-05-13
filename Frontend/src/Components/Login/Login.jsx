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

  const [showCollectorLogin, setShowCollectorLogin] = useState(false);
  const [collectorEmail, setCollectorEmail] = useState('');
  const [collectorPassword, setCollectorPassword] = useState('');
  const [collectorError, setCollectorError] = useState('');
  const [collectorLoading, setCollectorLoading] = useState(false);

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

  const handleCollectorSubmit = (e) => {
    e.preventDefault();
    setCollectorError('');
    setCollectorLoading(true);

    if (!collectorEmail || !collectorPassword) {
      setCollectorError('Please fill in all fields');
      setCollectorLoading(false);
      return;
    }

    // Simulate login (replace with axios later)
    setTimeout(() => {
      console.log('Collector login attempted:', { collectorEmail, collectorPassword });
      setCollectorLoading(false);
      // Do actual login handling here
    }, 1000);
  };

  return (
    <div className="LoginPage-container">
      {/* Collector Login Popup */}
      {showCollectorLogin && (
        <div className="collector-login-popup">
          <div className="collector-login-content">
            <button 
              className="collector-login-close"
              onClick={() => setShowCollectorLogin(false)}
            >
              &times;
            </button>
            <h2>Collector Login</h2>
            <p>Access your collector dashboard</p>

            {collectorError && <div className="collector-login-error">{collectorError}</div>}

            <form onSubmit={handleCollectorSubmit}>
              <div className="collector-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={collectorEmail}
                  onChange={(e) => setCollectorEmail(e.target.value)}
                  placeholder="collector@example.com"
                  required
                />
              </div>
              <div className="collector-form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={collectorPassword}
                  onChange={(e) => setCollectorPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" disabled={collectorLoading}>
                {collectorLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="collector-login-footer">
              <Link to="/collector-forgot-password">Forgot password?</Link>
              <span>
                Don’t have an account?{' '}
                <Link to="/collector-register">Register</Link>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Form */}
      <div className={`LoginPage-content ${showCollectorLogin ? 'blurred' : ''}`}>
        <div className="LoginPage-left">
          <h1 className="LoginPage-title">Welcome Back!</h1>
          <p className="LoginPage-subtitle">Log in to your N-Aluminium account.</p>
          <div className="LoginPage-collectorReg">
            <button 
              className="LoginPage-collectorBtn"
              onClick={() => setShowCollectorLogin(true)}
            >
              Login as Collector
            </button>
          </div>
        </div>

        <div className="LoginPage-right">
          <h2 className="LoginPage-signinTitle">Sign in</h2>
          <div className="LoginPage-message">
            {errorMessage && <div className="LoginPage-error">{errorMessage}</div>}
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="LoginPage-formGroup">
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
            <div className="LoginPage-formGroup">
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
              className="LoginPage-submit"
              disabled={isLoading || serverStatus !== 'online'}
            >
              {isLoading ? 'Signing in...' : serverStatus === 'checking' ? 'Connecting...' : 'Sign in now'}
            </button>
          </form>
          <div className="LoginPage-signupLink">
            Don't have an account? <Link to="/SignUp">Sign Up Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
