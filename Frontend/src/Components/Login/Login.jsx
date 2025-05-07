// src/Components/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Plain axios for status check
import axiosInstance from '../../api/axiosInstance'; // Default import
import { Link } from 'react-router-dom';
import API_ENDPOINTS from '../../apiConfig';
import './Login.css'; // Ensure this CSS file exists and is styled

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    console.log("[Login Comp] Component mounted. Clearing initial error message.");
    setErrorMessage('');
    checkBackendStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkBackendStatus = async () => {
    console.log("[Login Comp] checkBackendStatus called...");
    setServerStatus('checking');
    if (errorMessage.toLowerCase().includes('connection error') || errorMessage.toLowerCase().includes('cannot reach') || errorMessage.toLowerCase().includes('timed out') || errorMessage.toLowerCase().includes('network error')) {
        console.log("[Login Comp] Clearing previous connection-related error message.");
        setErrorMessage('');
    }
    try {
      const backendRootUrl = API_ENDPOINTS.BACKEND_ROOT_URL ? API_ENDPOINTS.BACKEND_ROOT_URL + '/' : 'http://localhost:5003/';
      console.log("[Login Comp] Pinging backend root:", backendRootUrl);
      await axios.get(backendRootUrl, { timeout: 5000 });
      console.log("[Login Comp] Backend status successfully determined: Online");
      setServerStatus('online');
      return true;
    } catch (err) {
      console.error("[Login Comp] Backend status check failed:", err.message);
      setServerStatus('offline');
      if (!errorMessage || errorMessage.toLowerCase().includes('connection error') || errorMessage.toLowerCase().includes('cannot reach') || errorMessage.toLowerCase().includes('timed out') || errorMessage.toLowerCase().includes('network error')) {
        setErrorMessage('Connection Error: Cannot reach the server. Please ensure it is running.');
      }
      return false;
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value.trim());
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Login Comp] handleSubmit initiated.');
    setErrorMessage('');

    if (!email) {
      console.log('[Login Comp] Validation failed: Email is empty.');
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      console.log('[Login Comp] Validation failed: Password is empty.');
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    console.log('[Login Comp] Attempting login. Email:', email, 'Server Status:', serverStatus);

    if (serverStatus !== 'online') {
        console.warn('[Login Comp] Server was not online, re-checking status before login attempt.');
        const isOnline = await checkBackendStatus();
        if (!isOnline) {
            console.warn('[Login Comp] Server still not online after re-check. Aborting login.');
            setIsLoading(false);
            return;
        }
        console.log('[Login Comp] Server back online after re-check. Proceeding with login.');
    }

    try {
      console.log(`[Login Comp] POSTing credentials to: ${API_ENDPOINTS.AUTH.LOGIN}`);
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password }
      );

      console.log('[Login Comp] Login API Raw Response:', response);

      if (response.data?.success && response.data?.token && response.data?.data) {
        console.log('%c[Login Comp] Login successful! Token & User Data received.', 'color: green; font-weight: bold;', {token: response.data.token, userData: response.data.data });
        onLoginSuccess(response.data.token, response.data.data);
      } else {
        const errMsg = response.data?.message || 'Login failed: Unexpected response from server.';
        console.error('[Login Comp] Login API call returned success, but data structure is invalid or indicates failure:', errMsg, 'Response Data:', response.data);
        setErrorMessage(errMsg);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('[Login Comp] Login API Call encountered an error:', err);
      handleApiError(err);
    }
  };

  const handleApiError = (error) => {
    setIsLoading(false);
    let displayErrorMessage = 'An unknown error occurred during login. Please try again.';

    if (error.code === 'ECONNABORTED') {
      displayErrorMessage = 'Login request timed out. The server might be busy or not responding.';
      setServerStatus('error');
    } else if (error.response) {
      const { data, status } = error.response;
      console.error(`[Login Comp] handleApiError - Server responded with Error Status: ${status}`, 'Response Data:', data);

      if (status === 401) {
        displayErrorMessage = data?.message || 'The email or password you entered is incorrect. Please check and try again.';
      } else if (status === 400) {
        displayErrorMessage = data?.message || 'There was an issue with the information you provided. Please check your details.';
      } else if (status === 403) {
        displayErrorMessage = data?.message || 'You do not have permission to log in with these credentials at this time.';
      } else if (status >= 500) {
        displayErrorMessage = data?.message || 'A server error occurred on our end. Please try again in a few moments.';
        setServerStatus('error');
      } else {
        displayErrorMessage = data?.message || `Login attempt failed (Error code: ${status}).`;
      }
    } else if (error.request) {
      console.error("[Login Comp] handleApiError - Network Error or No Response:", error.request);
      displayErrorMessage = 'Network Error: Could not connect to the server. Please check your internet connection and ensure the server is running.';
      setServerStatus('offline');
    } else {
      console.error('[Login Comp] handleApiError - Request Setup Error:', error.message);
      displayErrorMessage = error.message || 'An unexpected error occurred while preparing your login request.';
    }
    console.log("[Login Comp] Setting error message for UI:", displayErrorMessage);
    setErrorMessage(displayErrorMessage);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="left-section">
           <h1 className="welcome-title">Welcome Back!</h1>
           <p className="subtitle">Log in to your N-Aluminium account.</p>
        </div>
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>
          <div className="message-area" style={{ minHeight: '40px', marginBottom: '20px', width: '100%' }}>
             {errorMessage && (
               <div className="alert alert-danger" role="alert">
                 {errorMessage}
               </div>
             )}
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email" id="login-email" value={email} onChange={handleEmailChange}
                placeholder="you@example.com" autoComplete="email" required
                disabled={isLoading || serverStatus === 'checking'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password" id="login-password" value={password} onChange={handlePasswordChange}
                placeholder="Enter your password" autoComplete="current-password" required
                disabled={isLoading || serverStatus === 'checking'}
              />
            </div>
            <button type="submit" className="signin-button"
              disabled={isLoading || serverStatus === 'offline' || serverStatus === 'checking'}>
              {isLoading ? 'Signing in...' : (serverStatus === 'checking' ? 'Connecting...' : 'Sign in now')}
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