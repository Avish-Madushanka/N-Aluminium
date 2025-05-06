// Login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import API_ENDPOINTS from '../../apiConfig'; // Ensure this points correctly
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState(process.env.NODE_ENV === 'development' ? 'admin@example.com' : '');
  const [password, setPassword] = useState(process.env.NODE_ENV === 'development' ? 'admin123' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverStatus, setServerStatus] = useState('unknown'); // unknown, checking, online, offline, error
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');

    const params = new URLSearchParams(location.search);
    if (params.get('tokenExpired') === 'true') {
      setError('Your session has expired. Please log in again.');
    }
    checkBackendStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    return () => {
      setError('');
      setSuccess('');
    };
  }, []);

  const checkBackendStatus = async () => {
    setServerStatus('checking');
    try {
      // Assuming API_ENDPOINTS.utils.checkApiStatus handles checking ports
      const isOnline = await API_ENDPOINTS.utils.checkApiStatus();
      if (isOnline) {
        setServerStatus('online');
        if (error.includes('Network Error') || error.includes('server is offline') || error.includes('Cannot reach')) {
             setError(''); // Clear connection errors if server comes back online
         }
      } else {
        setServerStatus('offline');
        if (!error) { // Set error only if not already set by other means
            setError('Connection Error: Cannot reach the backend server. Please ensure it is running.');
        }
      }
      return isOnline;
    } catch (err) {
      console.error("Backend status check failed:", err);
      setServerStatus('offline');
       if (!error) {
            setError('Connection Error: Cannot reach the backend server. Please ensure it is running.');
        }
      return false;
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const apiUrl = API_ENDPOINTS.AUTH.LOGIN; // Use configured endpoint

    try {
      console.log(`[FRONTEND] Attempting login to ${apiUrl} with email: ${email}`);
      const response = await axios.post(
        apiUrl,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 8000 // Timeout in ms
        }
      );
      console.log('[FRONTEND] Login API Response:', response);

      if (!response || !response.data) {
        setLoading(false); // Ensure loading stops
        throw new Error("Received an invalid response format from the server.");
      }

      if (response.data.success && response.data.token && response.data.data) {
        const userData = response.data.data;
        const userRole = userData.role;
        const userType = userData.userType;

        console.log(`[FRONTEND] Login successful via backend. Role: ${userRole}, Type: ${userType}`);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(userData));

        if (userRole === 'admin') {
          setSuccess('Admin login successful! Redirecting...');
          const params = new URLSearchParams(location.search);
          const redirectPath = params.get('redirect');
          // No need to setLoading(false) here, navigation happens
          setTimeout(() => navigate(redirectPath || '/Admin', { replace: true }), 300); // Slightly faster redirect
        } else {
          setSuccess('Login successful! Redirecting...');
           // No need to setLoading(false) here, callback handles it
          setTimeout(() => onLoginSuccess(response.data.token, userData), 300); // Use callback for non-admins
        }
      } else {
         setLoading(false); // Ensure loading stops
        console.error("[FRONTEND] Backend login check failed:", response.data);
        // Use backend message if available
        throw new Error(response.data?.message || 'Login failed: Invalid credentials or server issue.');
      }
    } catch (err) {
      setLoading(false); // Ensure loading stops on any error
      console.error("[FRONTEND] Login error caught:", err);

      let errorMessage = 'An unknown error occurred during login.';
      if (err.response) { // Server responded with error status
        console.error("[FRONTEND] Server Error Details:", err.response.status, err.response.data);
        errorMessage = err.response.data?.message || `Login failed (Status: ${err.response.status}). Please check credentials.`;
        if (err.response.status >= 500) setServerStatus('error');
      } else if (err.request) { // No response received
        console.error("[FRONTEND] Network Error/No Response:", err.request);
        setServerStatus('offline');
        errorMessage = 'Network Error: Could not connect to the server. Please check if it is running.';
        checkBackendStatus(); // Re-check status on network error
      } else { // Setup error
        console.error('[FRONTEND] Request Setup Error:', err.message);
        errorMessage = `An unexpected error occurred: ${err.message}`;
      }
      setError(errorMessage);
    }
    // Removed finally block as setLoading should be handled within try/catch/success paths
  };

  // --- JSX Rendering ---
  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left Section */}
        <div className="left-section">
           <h1 className="welcome-title">Welcome</h1>
           <p className="subtitle">
             Log in to access your N-Aluminium account. Manage pickups, track history, and contribute to sustainable practices.
           </p>
           <div className="social-icons">
             <a href="#!" className="social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
             <a href="#!" className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
             <a href="#!" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
             <a href="#!" className="social-icon" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
           </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>

          {/* Status/Error Messages */}
           {serverStatus === 'offline' && (
             <div className="warning-message" style={{backgroundColor: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ffeeba'}}>
               <div style={{fontWeight: 'bold'}}>⚠️ Server Offline</div>
               <div>Cannot reach the backend. Please ensure it's running and check your network.</div>
             </div>
           )}
           {serverStatus === 'error' && (
             <div className="error-message">
               ⚠️ Experiencing issues connecting to the server. Please try again later.
             </div>
           )}
           {error && <div className="error-message">{error}</div>}
           {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="signin-button"
              disabled={loading || serverStatus === 'offline' || serverStatus === 'checking'}
            >
              {loading ? 'Signing in...' : 'Sign in now'}
            </button>
          </form>

          <div className="terms">
            By clicking on "Sign in now" you agree to <br />
            <a href="#!">Terms of Service</a> | <a href="#!">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;