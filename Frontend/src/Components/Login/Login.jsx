// Frontend/src/Components/Login/Login.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Adjust path if needed
import API_ENDPOINTS from '../../apiConfig';         // Adjust path if needed
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Adjust path if needed

import './Login.css'; // Ensure this path is correct

// Initial console logs for sanity checking imports (good for debugging)
// console.log('[Login.jsx] Mounted.');
// console.log('[Login.jsx] axiosInstance imported:', !!axiosInstance);
// console.log('[Login.jsx] API_ENDPOINTS imported:', API_ENDPOINTS ? JSON.stringify(API_ENDPOINTS) : 'API_ENDPOINTS IS UNDEFINED');
// console.log('[Login.jsx] useAuth imported:', !!useAuth);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline', 'error'

  const auth = useAuth();
  const navigate = useNavigate();

  const isConnectionError = (msg) =>
    msg && /connection error|cannot reach|timed out|network error|failed to fetch/i.test(String(msg).toLowerCase());

  const checkBackendStatus = useCallback(async () => {
    console.log('[Login.jsx] checkBackendStatus called.');
    setServerStatus('checking');
    // Clear connection-related errors before re-checking
    if (isConnectionError(errorMessage)) {
      setErrorMessage('');
    }

    // Ensure API_ENDPOINTS.HEALTH is defined for the check
    // This assumes your backend has a GET /api/health endpoint
    // and axiosInstance has baseURL: 'http://localhost:5003/api'
    const healthCheckEndpoint = API_ENDPOINTS?.HEALTH || '/health'; // Default to '/health'

    if (!healthCheckEndpoint) {
      console.warn("[Login.jsx] Health check endpoint is not configured in API_ENDPOINTS.HEALTH.");
      setServerStatus('error');
      setErrorMessage("Client configuration error for server health check.");
      return false;
    }

    try {
      // Use a relative path. axiosInstance will prepend its baseURL.
      console.log(`[Login.jsx] Pinging backend health at: ${healthCheckEndpoint}`);
      await axiosInstance.get(healthCheckEndpoint, { timeout: 7000 }); // Increased timeout slightly
      console.log('[Login.jsx] Backend health check successful.');
      setServerStatus('online');
      return true;
    } catch (err) {
      console.error("[Login.jsx] Backend health check failed:", err.message, err.code, err.response?.status);
      setServerStatus(err.code === 'ECONNABORTED' || !err.response ? 'offline' : 'error');
      // Only set a generic connection error if no other specific error is already displayed
      // or if the current error is also a connection type error.
      if (!errorMessage || isConnectionError(errorMessage)) {
        setErrorMessage('Connection Error: Cannot reach the server. Please ensure it is running and accessible.');
      }
      return false;
    }
  }, [errorMessage]); // Added errorMessage to dependencies

  useEffect(() => {
    // Initial backend status check
    checkBackendStatus();
  }, [checkBackendStatus]); // checkBackendStatus is memoized by useCallback

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage(!email ? "Please enter your email address." : "Please enter your password.");
      return;
    }
    setIsLoading(true);

    // Re-check server status only if it's not already 'online'
    if (serverStatus !== 'online') {
      console.log("[Login.jsx handleSubmit] Server not online, re-checking status...");
      const isOnline = await checkBackendStatus();
      if (!isOnline) {
        setIsLoading(false);
        // errorMessage will be set by checkBackendStatus
        return;
      }
    }

    // Critical dependency checks
    if (typeof auth?.login !== 'function') {
      console.error("[Login.jsx handleSubmit] CRITICAL: auth.login is not a function!");
      setErrorMessage("Login system error (auth context). Please contact support.");
      setIsLoading(false);
      return;
    }
    if (typeof API_ENDPOINTS?.AUTH?.LOGIN !== 'string') {
      console.error("[Login.jsx handleSubmit] CRITICAL: Login API Endpoint missing in API_ENDPOINTS.AUTH.LOGIN");
      setErrorMessage("Configuration error: Login endpoint missing. Cannot proceed.");
      setIsLoading(false);
      return;
    }

    try {
      console.log(`[Login.jsx handleSubmit] Attempting login to: ${API_ENDPOINTS.AUTH.LOGIN}`);
      // API_ENDPOINTS.AUTH.LOGIN should be a relative path like '/auth/login'
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

      if (response.data?.success && response.data?.token && response.data?.data) {
        console.log("[Login.jsx] Login successful for user:", response.data.data.email, "Role:", response.data.data.role);
        auth.login(response.data.token, response.data.data); // Pass user data to auth context
        
        // Navigate based on role
        const userRole = response.data.data.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard'); // Or your admin default route
        } else if (userRole === 'client') {
          navigate('/client/dashboard'); // Or your client default route
        } else if (userRole === 'businessOwner') {
          navigate('/bo/dashboard'); // Or your business owner default route
        }
        else {
          navigate('/'); // Fallback navigation
        }

      } else {
        const errMsg = response.data?.message || 'Login failed: Unexpected response from server.';
        console.warn("[Login.jsx] Login API call succeeded but indicates failure:", response.data);
        setErrorMessage(errMsg);
      }
    } catch (err) {
      // Error handling is now more robust in the Axios interceptor,
      // but we can still use a local handler for component-specific UI updates.
      console.error("[Login.jsx handleSubmit] Login API call failed:", err);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error) => {
    // setIsLoading(false); // Already handled in handleSubmit's finally block
    console.warn("[Login.jsx handleApiError]", error); // Use warn for non-critical display
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      setErrorMessage('Login request timed out. The server might be busy.');
      setServerStatus('error');
    } else if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message || `Login error (Status ${status}). Please try again.`;
      // Specific messages for common auth errors
      if (status === 400) setErrorMessage(msg || "Invalid input. Please check your details.");
      else if (status === 401) setErrorMessage(msg || 'Incorrect email or password.');
      else if (status === 403) setErrorMessage(msg || 'Access Denied.');
      else if (status === 404) setErrorMessage("Login service not found. Please contact support."); // Should not happen if health check passed
      else setErrorMessage(msg);

      if (status >= 500) setServerStatus('error');
    } else if (error.request) { // Network error, server unreachable
      setErrorMessage('Network Error: Unable to connect to the server.');
      setServerStatus('offline');
    } else { // Other errors (e.g., setup issues)
      setErrorMessage(error.message || 'An unexpected error occurred during login.');
    }
  };

  // Critical dependency check (good for early error detection)
  if (typeof API_ENDPOINTS === 'undefined' || typeof auth === 'undefined' || typeof auth.login !== 'function') {
    const errorDetails = `API_ENDPOINTS: ${API_ENDPOINTS ? 'Loaded' : 'MISSING! Check import/config.'}. Auth Context: ${auth ? 'Loaded' : 'MISSING! Check AuthProvider.'}. Auth.login function: ${auth && typeof auth.login === 'function' ? 'Available' : 'MISSING on AuthContext!'}`;
    console.error("[Login.jsx] Critical dependency error on mount:", errorDetails);
    return (
      <div className="LoginPage-container error-page" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Application Setup Error</h2>
        <p style={{ color: 'red', fontWeight: 'bold' }}>A critical part of the application is not working.</p>
        <p>Details: {errorDetails}</p>
        <p>Please check the browser console and ensure API_ENDPOINTS are configured and the AuthProvider is correctly set up in your application's root (e.g., App.jsx or main.jsx).</p>
      </div>
    );
  }

  return (
    <div className="LoginPage-container">
      <div className="LoginPage-content">
        <div className="LoginPage-left">
          {/* Decorative content, logo, etc. */}
          <h1 className="LoginPage-title">Welcome Back!</h1>
          <p className="LoginPage-subtitle">Log in to manage your N-Aluminium account.</p>
          {/* You can add an image or illustration here */}
        </div>
        <div className="LoginPage-right">
          <h2 className="LoginPage-signinTitle">Sign In</h2>
          <div className="LoginPage-status-message">
            {/* Display server status subtly unless it's an error */}
            {serverStatus === 'checking' && <p className="status-checking">Connecting to server...</p>}
            {/* {serverStatus === 'online' && <p className="status-online">Server Connected</p>} */}
            {/* errorMessage will display more prominent errors */}
          </div>
          {errorMessage && <div className="LoginPage-error">{errorMessage}</div>}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="LoginPage-formGroup">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                name="email" // Consistent naming
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Removed .trim() here, can trim on submit
                placeholder="you@example.com"
                autoComplete="email" // More standard autocomplete
                required
                disabled={isLoading || serverStatus === 'checking'}
              />
            </div>
            <div className="LoginPage-formGroup">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                name="password" // Consistent naming
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password" // More standard autocomplete
                required
                disabled={isLoading || serverStatus === 'checking'}
              />
            </div>
            <button 
              type="submit" 
              className="LoginPage-submit" 
              disabled={isLoading || serverStatus !== 'online'}
            >
              {isLoading ? 'Signing in...' : (serverStatus === 'checking' ? 'Connecting...' : 'Sign in')}
            </button>
          </form>
          <div className="LoginPage-extraLinks">
            {/* <Link to="/forgot-password">Forgot Password?</Link> */}
          </div>
          <div className="LoginPage-signupLink">
            Don't have an account? <Link to="/SignUp">Sign Up Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;