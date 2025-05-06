// src/Components/Login/Login.jsx (No functional changes needed from previous version)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API_ENDPOINTS from '../../apiConfig';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
    const params = new URLSearchParams(location.search);
    if (params.get('sessionExpired') === 'true' || params.get('tokenExpired') === 'true') {
      setErrorMessage('Your session has expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
    checkBackendStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkBackendStatus = async () => {
    setServerStatus('checking');
    if (errorMessage.includes('Network Error') || errorMessage.includes('Cannot reach') || errorMessage.includes('connect')) {
        setErrorMessage('');
    }
    try {
      await axios.get(API_ENDPOINTS.BASE_URL, { timeout: 3500 });
      console.log("[Login Component] Backend status check: Online");
      setServerStatus('online');
      return true;
    } catch (err) {
      console.error("[Login Component] Backend status check failed:", err.message);
      setServerStatus('offline');
      if (!errorMessage) {
        setErrorMessage('Connection Error: Cannot reach the server. Please ensure it is running.');
      }
      return false;
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
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

    const apiUrl = API_ENDPOINTS.AUTH.LOGIN;

    try {
      console.log(`[Login Component] Attempting login to ${apiUrl} for email: ${email}`);
      const response = await axios.post(
        apiUrl, { email, password },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );
      // Line 100 (approx) - Logging error if caught below
      console.log('[Login Component] Backend API Response:', response);

      if (response?.data?.success && response?.data?.token && response?.data?.data) {
        console.log("[Login Component] Backend confirmed login success.");
        setSuccessMessage('Login successful! Redirecting...');
        onLoginSuccess(response.data.token, response.data.data);
      } else {
        console.error("[Login Component] Backend login logical failure:", response.data);
        throw new Error(response.data?.message || response.data?.error || 'Login failed: Invalid response from server.');
      }
    } catch (err) {
      setIsLoading(false);
      // Line 113 (approx) - Calling handleApiError
      console.error("[Login Component] Login error caught:", err);
      handleApiError(err);
    }
  };

  const handleApiError = (error) => {
    let displayErrorMessage = 'An unknown error occurred during login.';
    if (error.code === 'ECONNABORTED') {
      displayErrorMessage = 'Request timed out. Please check your connection.';
      setServerStatus('offline');
    } else if (error.response) {
      const { data, status } = error.response;
      console.error(`[Login Component] Server Error: Status ${status}`, data); // This should show 500 status
      if (status === 401 || status === 400) {
        displayErrorMessage = data?.error || data?.message || 'Invalid email or password.';
      } else if (status === 403) {
        displayErrorMessage = data?.error || data?.message || 'Access forbidden.';
      } else if (status >= 500) { // <<< This path is being hit <<<
        displayErrorMessage = data?.error || data?.message || 'Server error. Please try again later or contact support.';
        setServerStatus('error');
      } else {
        displayErrorMessage = data?.error || data?.message || `Login failed (Error: ${status}).`;
      }
    } else if (error.request) {
      console.error("[Login Component] Network Error/No Response:", error.request);
      displayErrorMessage = 'Network Error: Could not connect to the server.';
      setServerStatus('offline');
    } else {
      console.error('[Login Component] Request Setup or Logical Error:', error.message);
      displayErrorMessage = error.message || 'An unexpected error occurred.';
    }
    setErrorMessage(displayErrorMessage);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="left-section">
           <h1 className="welcome-title">Welcome Back!</h1>
           <p className="subtitle">
             Log in to manage your aluminium collections and contribute to sustainability.
           </p>
        </div>
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>
          <div className="message-area" style={{ minHeight: '40px', marginBottom: '15px' }}>
            {serverStatus === 'offline' && (
              <div className="alert alert-warning" role="alert">
                <strong>Server Offline:</strong> Cannot reach the backend. Please check connection.
              </div>
            )}
             {/* Show specific server error message */}
            {errorMessage && (serverStatus === 'error' || errorMessage.includes('Server error')) && (
              <div className="alert alert-danger" role="alert">
                <strong>Server Error:</strong> Please try again later or contact support. {/* Keep generic message for user */}
              </div>
            )}
             {/* Show other errors like invalid credentials only if server is 'online' */}
            {errorMessage && serverStatus === 'online' && !errorMessage.includes('Server error') && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email" id="login-email" value={email} onChange={handleEmailChange}
                placeholder="you@example.com" autoComplete="email" required disabled={isLoading}
                aria-required="true" aria-invalid={!!errorMessage}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password" id="login-password" value={password} onChange={handlePasswordChange}
                placeholder="Enter your password" autoComplete="current-password" required disabled={isLoading}
                aria-required="true" aria-invalid={!!errorMessage}
              />
            </div>
            <button
              type="submit" className="signin-button"
              disabled={isLoading || serverStatus === 'offline' || serverStatus === 'checking'}
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ display: 'inline-block', marginRight: '8px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '14px', height: '14px', animation: 'spin 1s linear infinite' }}></span>
                  Signing in...
                   {/* Keyframes for spinner (add to your CSS) */}
                   {/* @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } */}
                </>
              ) : 'Sign in now'}
            </button>
          </form>

          <div className="signup-link-container" style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9em' }}>
            Don't have an account?{' '}
            <Link to="/SignUp" className="signup-link">Sign Up Now</Link>
          </div>
          <div className="terms" style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.8em', color: '#666' }}>
            By signing in, you agree to our <br />
            <Link to="/terms">Terms of Service</Link> | <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;