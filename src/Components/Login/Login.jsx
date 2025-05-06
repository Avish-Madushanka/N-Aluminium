// src/Components/Login/Login.jsx (Minor changes from previous full code)
import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Using axiosInstance now
import axiosInstance from '../../api/axiosInstance'; // Import instance
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API_ENDPOINTS from '../../apiConfig';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For specific login errors
  const [successMessage, setSuccessMessage] = useState(''); // Used briefly on success maybe? (App handles redirect)
  const [serverStatus, setServerStatus] = useState('checking');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local component errors on mount. App.jsx handles URL param messages.
    setErrorMessage('');
    setSuccessMessage('');
    checkBackendStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const checkBackendStatus = async () => {
    setServerStatus('checking');
    if (errorMessage.includes('Network Error') || errorMessage.includes('Cannot reach') || errorMessage.includes('connect')) {
        setErrorMessage('');
    }
    try {
      await axiosInstance.get(API_ENDPOINTS.BASE_URL, { timeout: 3500 }); // Use axiosInstance
      console.log("[Login Component] Backend status check: Online");
      setServerStatus('online');
      return true;
    } catch (err) {
      console.error("[Login Component] Backend status check failed:", err.message);
      setServerStatus('offline');
      if (!errorMessage) {
        setErrorMessage('Connection Error: Cannot reach the server.');
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

    if (serverStatus !== 'online') { /* ... check status ... */ }

    const apiUrl = API_ENDPOINTS.AUTH.LOGIN;

    try {
      const response = await axiosInstance.post( // Use axiosInstance
        apiUrl, { email, password },
        // No need for headers, interceptor adds token (though not needed for login)
        { timeout: 10000 }
      );
      if (response?.data?.success && response?.data?.token && response?.data?.data) {
        // Success! Call parent handler.
        onLoginSuccess(response.data.token, response.data.data);
        // No need to set local success message or stop loading if parent navigates
      } else {
        throw new Error(response.data?.message || response.data?.error || 'Login failed: Invalid server response.');
      }
    } catch (err) {
      setIsLoading(false);
      handleApiError(err); // handleApiError sets errorMessage state
    }
  };

  const handleApiError = (error) => {
    // This function now primarily sets errors specific to the login attempt,
    // as 401s are handled globally by the interceptor leading to logout.
    let displayErrorMessage = 'An unknown error occurred during login.';
    if (error.code === 'ECONNABORTED') {
      displayErrorMessage = 'Request timed out.'; setServerStatus('offline');
    } else if (error.response) {
      const { data, status } = error.response;
      console.error(`[Login Component] Server Error: Status ${status}`, data);
      // Focus on errors relevant to login failure (400/401/403)
      if (status === 401 || status === 400) {
        displayErrorMessage = data?.error || data?.message || 'Invalid email or password.';
      } else if (status === 403) {
        displayErrorMessage = data?.error || data?.message || 'Access forbidden.';
      } else if (status >= 500) {
        displayErrorMessage = 'Server error occurred. Please try again later.'; // Keep generic for 500
        setServerStatus('error');
      } else {
        displayErrorMessage = data?.error || data?.message || `Login failed (Error: ${status}).`;
      }
    } else if (error.request) {
      displayErrorMessage = 'Network Error: Could not connect.'; setServerStatus('offline');
    } else {
      displayErrorMessage = error.message || 'An unexpected login error occurred.';
    }
    setErrorMessage(displayErrorMessage);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="left-section">
           <h1 className="welcome-title">Welcome Back!</h1>
           <p className="subtitle">Log in to manage your collections.</p>
        </div>
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>
          {/* Message area will be handled by App.jsx for session expiry */}
          {/* Display local errors (e.g., invalid credentials) */}
          <div className="message-area" style={{ minHeight: '40px', marginBottom: '15px' }}>
             {errorMessage && (
               <div className="alert alert-danger" role="alert">
                 {errorMessage}
               </div>
             )}
              {/* Success message is less relevant now as redirect happens */}
             {/* {successMessage && <div className="alert alert-success">{successMessage}</div>} */}
          </div>

          <form onSubmit={handleSubmit} noValidate>
             {/* Form inputs remain the same */}
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input type="email" id="login-email" value={email} onChange={handleEmailChange} /* ... */ />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input type="password" id="login-password" value={password} onChange={handlePasswordChange} /* ... */ />
            </div>
            <button type="submit" className="signin-button" disabled={isLoading || serverStatus === 'offline' || serverStatus === 'checking'}>
              {isLoading ? 'Signing in...' : 'Sign in now'}
            </button>
          </form>

           {/* Sign up / Terms links remain the same */}
           <div className="signup-link-container" /* ... */> Don't have an account? <Link to="/SignUp" className="signup-link">Sign Up Now</Link> </div>
           <div className="terms" /* ... */> By signing in... <Link to="/terms">Terms</Link> | <Link to="/privacy">Privacy</Link> </div>
        </div>
      </div>
    </div>
  );
}

export default Login;