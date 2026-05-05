import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const storedRedirectPath = sessionStorage.getItem('redirectAfterLogin');

  const checkBackendStatus = useCallback(async () => {
    setServerStatus('checking');
    try {
      await axiosInstance.get(API_ENDPOINTS.HEALTH_CHECK, { timeout: 7000 });
      setServerStatus('online');
      return true;
    } catch (err) {
      setServerStatus('offline');
      setErrorMessage('Cannot reach the server. Please ensure it is running.');
      return false;
    }
  }, []);

  useEffect(() => {
    checkBackendStatus();
  }, [checkBackendStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage(!email ? 'Please enter your email address.' : 'Please enter your password.');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

      if (response.data?.success && response.data?.token && response.data?.data) {
        auth.login(response.data.token, response.data.data);
        
        const userRole = response.data.data.role;
        let redirectPath = '/';
        
        if (storedRedirectPath && storedRedirectPath !== '/login') {
          redirectPath = storedRedirectPath;
        } else if (from && from !== '/') {
          redirectPath = from;
        } else if (userRole === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (userRole === 'client') {
          redirectPath = '/client/dashboard';
        } else if (userRole === 'businessOwner') {
          redirectPath = '/bo/dashboard';
        }
        
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMessage(response.data?.message || 'Login failed.');
      }
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data?.message || 'Login failed. Please try again.');
      } else if (err.request) {
        setErrorMessage('Network error. Cannot connect to server.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
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
      setResetError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }

    setIsResetting(true);

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email: resetEmail });

      if (response.data?.success) {
        setResetSuccess(true);
        setResetMessage(response.data.message || 'Password reset instructions have been sent to your email.');
      } else {
        setResetError(response.data?.message || 'Failed to process request.');
      }
    } catch (err) {
      if (err.response) {
        setResetError(err.response.data?.message || `Error ${err.response.status}. Please try again.`);
      } else if (err.request) {
        setResetError('Network error. Unable to connect to server.');
      } else {
        setResetError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsResetting(false);
    }
  };

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
                    <p>{resetMessage}</p>
                    <button onClick={handleBackToLogin} className="LOG-back-btn">
                      Back to Login
                    </button>
                  </div>
                ) : (
                  <>
                    {resetError && (
                      <div className="LOG-error-message">
                        {resetError}
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
                          disabled={isResetting}
                        />
                      </div>

                      <button
                        type="submit"
                        className="LOG-reset-btn"
                        disabled={isResetting}
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