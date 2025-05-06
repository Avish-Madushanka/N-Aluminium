// src/Components/Login/Login.jsx (or wherever your Login component is)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Added Link for Sign Up
import API_ENDPOINTS from '../../apiConfig'; // Assuming this points to your backend URL correctly
import './Login.css'; // Ensure CSS path is correct

// Login component now receives onLoginSuccess prop from App.jsx
function Login({ onLoginSuccess }) {
  // --- State Variables ---
  const [email, setEmail] = useState(''); // Start empty
  const [password, setPassword] = useState(''); // Start empty
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // To show success message briefly
  const [serverStatus, setServerStatus] = useState('unknown'); // unknown, checking, online, offline, error
  const location = useLocation(); // To get potential redirect state

  // --- Effects ---
  useEffect(() => {
    // Clear potential error messages from previous attempts or redirects
    setError('');
    setSuccess('');

    // Check if redirected due to token expiry
    const params = new URLSearchParams(location.search);
    if (params.get('tokenExpired') === 'true') {
      setError('Your session has expired. Please log in again.');
      // Clear potential invalid token just in case (App.jsx might also do this)
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }

    // Check backend status on component mount
    checkBackendStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Effect to clear messages on unmount
  useEffect(() => {
    return () => {
      setError('');
      setSuccess('');
    };
  }, []);

  // --- Helper Functions ---
  const checkBackendStatus = async () => {
    setServerStatus('checking');
    try {
      // Use utility function if available, otherwise basic check
      let isOnline = false;
      if (API_ENDPOINTS.utils?.checkApiStatus) {
        isOnline = await API_ENDPOINTS.utils.checkApiStatus();
      } else {
        // Basic fallback check
        await axios.get(API_ENDPOINTS.BASE_URL || window.location.origin, { timeout: 3000 });
        isOnline = true;
      }

      if (isOnline) {
        setServerStatus('online');
        // Clear connection-related errors if now online
        if (error.includes('Network Error') || error.includes('server is offline') || error.includes('Cannot reach')) {
            setError('');
        }
      } else {
        setServerStatus('offline');
         if (!error) setError('Connection Error: Cannot reach the server.');
      }
      return isOnline;
    } catch (err) {
      console.error("Backend status check failed:", err);
      setServerStatus('offline');
      if (!error) setError('Connection Error: Cannot reach the server.');
      return false;
    }
  };

  // --- Event Handlers ---
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // --- Form Submission Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // Use the standard login endpoint from config
    const apiUrl = API_ENDPOINTS.AUTH.LOGIN;

    try {
      console.log(`[LOGIN] Attempting login to ${apiUrl} for email: ${email}`);
      // --- Send credentials to the backend for validation ---
      const response = await axios.post(
        apiUrl,
        { email, password }, // Send email and password
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 8000 // Timeout
        }
      );
      console.log('[LOGIN] Backend API Response:', response);

      // Check if the backend confirms success and provides necessary data
      if (response?.data?.success && response?.data?.token && response?.data?.data) {
        console.log("[LOGIN] Backend confirmed success.");
        setSuccess('Login successful! Redirecting...');

        // Call the handler passed from App.jsx, providing token and user data
        // App.jsx will handle state update, localStorage, and navigation
        onLoginSuccess(response.data.token, response.data.data);

        // No need to setLoading(false) here, as navigation will unmount the component
        // or be handled by the parent state update.

      } else {
         // Handle cases where API call succeeded but backend logic failed (e.g., success: false)
         console.error("[LOGIN] Backend login check failed:", response.data);
         setLoading(false); // Stop loading
         throw new Error(response.data?.message || 'Login failed: Invalid response from server.');
      }
    } catch (err) {
        setLoading(false); // Stop loading on any error
        console.error("[LOGIN] Login error caught:", err);

        let errorMessage = 'An unknown error occurred during login.';
        if (err.response) { // Server responded with an error status (4xx, 5xx)
            console.error("[LOGIN] Server Error Details:", err.response.status, err.response.data);
             if (err.response.status === 401 || err.response.status === 400) {
                errorMessage = err.response.data?.message || 'Invalid email or password. Please try again.';
             } else if (err.response.status === 403) {
                errorMessage = err.response.data?.message || 'Access forbidden. Please contact an administrator.';
             } else if (err.response.status >= 500) {
                errorMessage = err.response.data?.message || 'A server error occurred. Please try again later.';
                setServerStatus('error');
             } else {
                 errorMessage = err.response.data?.message || `Login failed (Status: ${err.response.status}).`;
             }
        } else if (err.request) { // No response received (Network Error, Server Down)
            console.error("[LOGIN] Network Error/No Response:", err.request);
            setServerStatus('offline');
            errorMessage = 'Network Error: Could not connect to the server.';
            checkBackendStatus(); // Re-check status
        } else { // Error setting up the request
            console.error('[LOGIN] Request Setup Error:', err.message);
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
        {/* Left Section (Optional Visuals) */}
        <div className="left-section">
           <h1 className="welcome-title">Welcome Back!</h1>
           <p className="subtitle">
             Log in to manage your aluminium collections and contribute to sustainability.
           </p>
           {/* Add image or other elements if desired */}
        </div>

        {/* Right Section (Login Form) */}
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>

          {/* Server Status/Error/Success Messages */}
           {serverStatus === 'offline' && (
             <div className="warning-message" style={{backgroundColor: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ffeeba'}}>
               <div style={{fontWeight: 'bold'}}>⚠️ Server Offline</div>
               <div>Cannot reach the backend. Please check connection or if the server is running.</div>
             </div>
           )}
            {serverStatus === 'error' && (
             <div className="error-message">
               ⚠️ Server error occurred. Please try again later.
             </div>
           )}
           {error && <div className="error-message">{error}</div>}
           {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email" // Unique ID
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password" // Unique ID
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

          <div className="signup-link-container" style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9em' }}>
            Don't have an account?{' '}
            <Link to="/SignUp" className="signup-link">Sign Up Now</Link>
          </div>

          <div className="terms">
            By signing in, you agree to our <br />
            <Link to="/terms">Terms of Service</Link> | <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;