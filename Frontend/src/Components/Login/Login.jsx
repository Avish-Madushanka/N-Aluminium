// Frontend/src/Components/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import './Login.css';

console.log('[Login.jsx] Mounted.');
console.log('[Login.jsx] axiosInstance imported:', !!axiosInstance);
console.log('[Login.jsx] API_ENDPOINTS imported:', API_ENDPOINTS ? 'Object received' : 'API_ENDPOINTS IS UNDEFINED - CHECK IMPORT');
console.log('[Login.jsx] useAuth imported:', !!useAuth);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage('');
    if (typeof API_ENDPOINTS?.BACKEND_ROOT_URL !== 'string') {
      console.warn("[Login.jsx] API_ENDPOINTS.BACKEND_ROOT_URL is not configured.");
      setServerStatus('error');
      setErrorMessage("Client configuration error for server check.");
    } else {
      checkBackendStatus();
    }
  }, []);

  const isConnectionError = (msg) =>
    msg && /connection error|cannot reach|timed out|network error/i.test(String(msg).toLowerCase());

  const checkBackendStatus = async () => {
    const backendRootUrl = API_ENDPOINTS?.BACKEND_ROOT_URL || 'http://localhost:5003/';
    setServerStatus('checking');
    if (isConnectionError(errorMessage)) {
      setErrorMessage('');
    }
    try {
      await axiosInstance.get(backendRootUrl.replace('/api', ''), { timeout: 5000 });
      setServerStatus('online');
      return true;
    } catch (err) {
      console.error("[Login.jsx] Backend check failed:", err.message);
      setServerStatus('offline');
      if (!errorMessage || isConnectionError(errorMessage)) {
        setErrorMessage('Connection Error: Cannot reach the server. Please ensure it is running and accessible.');
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

    if (typeof auth?.login !== 'function') {
      console.error("[Login.jsx handleSubmit] CRITICAL: auth.login is not a function!");
      setErrorMessage("Login system error (auth context). Please try again later or contact support.");
      setIsLoading(false);
      return;
    }
    if (typeof API_ENDPOINTS?.AUTH?.LOGIN !== 'string') {
      console.error("[Login.jsx handleSubmit] CRITICAL: Login API Endpoint missing.");
      setErrorMessage("Configuration error: Login endpoint missing. Cannot proceed.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      if (response.data?.success && response.data?.token && response.data?.data) {
        console.log("[Login.jsx] Login successful for user:", response.data.data.email);
        auth.login(response.data.token, response.data.data);
      } else {
        const errMsg = response.data?.message || 'Login failed: Unexpected response from server.';
        console.warn("[Login.jsx] Login failed:", response.data);
        setErrorMessage(errMsg);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error) => {
    setIsLoading(false);
    console.error("[Login.jsx handleApiError]", error);
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      setErrorMessage('Login request timed out. The server might be busy or not responding.');
      setServerStatus('error');
      return;
    }
    if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message || `An error occurred (Status ${status}).`;
      switch (status) {
        case 400: setErrorMessage(msg); break;
        case 401: setErrorMessage(msg || 'Incorrect email or password.'); break;
        case 403: setErrorMessage(msg || 'Access denied.'); break;
        default: setErrorMessage(msg); if (status >= 500) setServerStatus('error');
      }
    } else if (error.request) {
      setErrorMessage('Network Error: Could not connect to the server.');
      setServerStatus('offline');
    } else {
      setErrorMessage(error.message || 'Unexpected login error.');
    }
  };

  if (typeof API_ENDPOINTS === 'undefined' || typeof auth === 'undefined' || typeof auth.login !== 'function') {
    const errorDetails = `API_ENDPOINTS: ${API_ENDPOINTS ? 'Loaded' : 'MISSING! Check import.'}. Auth Context: ${auth ? 'Loaded' : 'MISSING!'}. Auth Login Fn: ${auth && typeof auth.login === 'function' ? 'Available' : 'MISSING!'}`;
    console.error("[Login.jsx] Critical dependency error:", errorDetails);
    return (
      <div className="LoginPage-container error-page" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Application Configuration Error</h2>
        <p style={{ color: 'red', fontWeight: 'bold' }}>A critical part of the application is not configured correctly.</p>
        <p>Details: {errorDetails}</p>
        <p>Please check the browser console and ensure all imports are correct and the AuthProvider is set up in App.jsx.</p>
      </div>
    );
  }

  return (
    <div className="LoginPage-container">
      <div className="LoginPage-content">
        <div className="LoginPage-left">
          <h1 className="LoginPage-title">Welcome Back!</h1>
          <p className="LoginPage-subtitle">Log in to your N-Aluminium account.</p>
        </div>
        <div className="LoginPage-right">
          <h2 className="LoginPage-signinTitle">Sign in</h2>
          <div className="LoginPage-message">
            {errorMessage && <div className="LoginPage-error">{errorMessage}</div>}
          </div>
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="LoginPage-formGroup">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                name="loginEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="you@example.com"
                autoComplete="off"
                required
                disabled={isLoading || serverStatus === 'checking'}
              />
            </div>
            <div className="LoginPage-formGroup">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                name="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="new-password"
                required
                disabled={isLoading || serverStatus === 'checking'}
              />
            </div>
            <button type="submit" className="LoginPage-submit" disabled={isLoading || serverStatus !== 'online'}>
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
