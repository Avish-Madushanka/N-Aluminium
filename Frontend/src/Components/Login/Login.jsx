import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance'; 
import API_ENDPOINTS from '../../apiConfig';        
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  
import './Login.css'; 

function Login() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); 
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const isConnectionError = (msg) =>
    msg && /connection error|cannot reach|timed out|network error|failed to fetch/i.test(String(msg).toLowerCase());

  const checkBackendStatus = useCallback(async () => {
    setServerStatus('checking');
    if (isConnectionError(errorMessage)) {
      setErrorMessage('');
    }

    const healthCheckEndpoint = API_ENDPOINTS?.HEALTH || '/health'; 

    if (!healthCheckEndpoint) {
      setServerStatus('error');
      setErrorMessage("Client configuration error for server health check.");
      return false;
    }

    try {
      await axiosInstance.get(healthCheckEndpoint, { timeout: 7000 }); 
      setServerStatus('online');
      return true;
    } catch (err) {
      setServerStatus(err.code === 'ECONNABORTED' || !err.response ? 'offline' : 'error');
      if (!errorMessage || isConnectionError(errorMessage)) {
        setErrorMessage('Connection Error: Cannot reach the server. Please ensure it is running and accessible.');
      }
      return false;
    }
  }, [errorMessage]);

  useEffect(() => {
    checkBackendStatus();
  }, [checkBackendStatus]);

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
      setErrorMessage("Login system error. Please contact support.");
      setIsLoading(false);
      return;
    }
    if (typeof API_ENDPOINTS?.AUTH?.LOGIN !== 'string') {
      setErrorMessage("Configuration error: Login endpoint missing.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

      if (response.data?.success && response.data?.token && response.data?.data) {
        auth.login(response.data.token, response.data.data); 
        
        const userRole = response.data.data.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard'); 
        } else if (userRole === 'client') {
          navigate('/client/dashboard'); 
        } else if (userRole === 'businessOwner') {
          navigate('/bo/dashboard'); 
        } else {
          navigate('/');
        }
      } else {
        const errMsg = response.data?.message || 'Login failed: Unexpected response from server.';
        setErrorMessage(errMsg);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setResetEmail('');
    setResetMessage('');
    setResetError('');
    setResetSuccess(false);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetMessage('');
    setResetError('');
    setResetSuccess(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    
    if (!resetEmail) {
      setResetError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError("Please enter a valid email address.");
      return;
    }

    setIsResetting(true);

    if (serverStatus !== 'online') {
      const isOnline = await checkBackendStatus();
      if (!isOnline) {
        setIsResetting(false);
        return;
      }
    }

    try {
      const forgotPasswordEndpoint = API_ENDPOINTS?.AUTH?.FORGOT_PASSWORD || '/api/auth/forgot-password';
      const response = await axiosInstance.post(forgotPasswordEndpoint, { email: resetEmail });

      if (response.data?.success) {
        setResetSuccess(true);
        setResetMessage(response.data?.message || 'Password reset instructions have been sent to your email.');
      } else {
        setResetError(response.data?.message || 'Failed to process password reset request.');
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 404) {
          setResetError('Email address not found in our records.');
        } else if (status === 400) {
          setResetError(data?.message || 'Invalid request. Please check your email address.');
        } else {
          setResetError(data?.message || `Error (${status}). Please try again later.`);
        }
      } else if (err.request) {
        setResetError('Network error. Unable to connect to the server.');
      } else {
        setResetError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleApiError = (error) => {
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      setErrorMessage('Login request timed out. The server might be busy.');
      setServerStatus('error');
    } else if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message || `Login error (Status ${status}). Please try again.`;
      
      if (status === 400) setErrorMessage(msg || "Invalid input. Please check your details.");
      else if (status === 401) setErrorMessage(msg || 'Incorrect email or password.');
      else if (status === 403) setErrorMessage(msg || 'Access Denied.');
      else if (status === 404) setErrorMessage("Login service not found. Please contact support."); 
      else setErrorMessage(msg);

      if (status >= 500) setServerStatus('error');
    } else if (error.request) {
      setErrorMessage('Network Error: Unable to connect to the server.');
      setServerStatus('offline');
    } else { 
      setErrorMessage(error.message || 'An unexpected error occurred during login.');
    }
  };

  if (typeof API_ENDPOINTS === 'undefined' || typeof auth === 'undefined' || typeof auth.login !== 'function') {
    return (
      <div className="LOG-error-page">
        <h2>Application Setup Error</h2>
        <p>A critical part of the application is not working.</p>
      </div>
    );
  }

  return (
    <div className="LOG-container">
      <div className="LOG-wrapper">
        <div className="LOG-quote-section">
          <div className="LOG-quote-content">
            <h1>"Welcome to the future <br/>of aluminum – recycle, <br/>trade, design!"</h1>
          </div>
        </div>

        <div className="LOG-form-section">
          <div className="LOG-form-content">
            {!showForgotPassword ? (
              <>
                <div className="LOG-header">
                  <h2>Welcome Back!</h2>
                  <p>Log in to manage your N-Aluminium account</p>
                </div>

                {serverStatus === 'checking' && (
                  <div className="LOG-status-message">
                    <p>Connecting to server...</p>
                  </div>
                )}
                
                {errorMessage && (
                  <div className="LOG-error-message">
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="LOG-form">
                  <div className="LOG-form-group">
                    <label htmlFor="LOG-email">Email Address</label>
                    <input
                      type="email"
                      id="LOG-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={isLoading || serverStatus === 'checking'}
                    />
                  </div>
                  
                  <div className="LOG-form-group">
                    <label htmlFor="LOG-password">Password</label>
                    <input
                      type="password"
                      id="LOG-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading || serverStatus === 'checking'}
                    />
                  </div>
                  
                  <div className="LOG-forgot-password">
                    <button 
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="LOG-forgot-btn"
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="LOG-submit-btn"
                    disabled={isLoading || serverStatus !== 'online'}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>

                <div className="LOG-signup-link">
                  <p>
                    Don't have an account? <Link to="/SignUp">Sign Up Now</Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="LOG-header">
                  <h2>Reset Password</h2>
                  <p>Enter your email to receive reset instructions</p>
                </div>

                {resetSuccess ? (
                  <div className="LOG-success-message">
                    <i className="fas fa-check-circle"></i>
                    <p>{resetMessage || 'Password reset instructions have been sent to your email.'}</p>
                    <button onClick={handleBackToLogin} className="LOG-back-btn">
                      Back to Login
                    </button>
                  </div>
                ) : (
                  <>
                    {serverStatus === 'checking' && (
                      <div className="LOG-status-message">
                        <p>Connecting to server...</p>
                      </div>
                    )}
                    
                    {resetError && (
                      <div className="LOG-error-message">
                        {resetError}
                      </div>
                    )}
                    
                    {resetMessage && (
                      <div className="LOG-info-message">
                        {resetMessage}
                      </div>
                    )}
                    
                    <form onSubmit={handleResetPassword} className="LOG-form">
                      <div className="LOG-form-group">
                        <label htmlFor="LOG-reset-email">Email Address</label>
                        <input
                          type="email"
                          id="LOG-reset-email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="Enter your registered email"
                          disabled={isResetting || serverStatus === 'checking'}
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="LOG-reset-btn"
                        disabled={isResetting || serverStatus !== 'online'}
                      >
                        {isResetting ? 'Sending...' : 'Send Reset Instructions'}
                      </button>
                      
                      <button 
                        type="button"
                        onClick={handleBackToLogin}
                        className="LOG-back-link"
                        disabled={isResetting}
                      >
                        ← Back to Login
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;