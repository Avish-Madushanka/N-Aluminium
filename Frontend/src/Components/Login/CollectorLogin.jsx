// src/Components/Login/CollectorLogin.jsx
// Or src/Pages/CollectorLoginPage.jsx - ensure filename matches your App.jsx import

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ========================== VERY IMPORTANT =====================================
// !! VERIFY THESE PATHS AGAINST YOUR ACTUAL PROJECT STRUCTURE !!
import axiosInstance from '../../api/axiosInstance'; // Assumes axiosInstance.js is in src/api/
import API_ENDPOINTS from '../../api/apiConfig';   // Assumes apiConfig.js is in src/api/
import { useAuth } from '../../App';             // Assumes App.jsx is in src/
// ==============================================================================

import './CollectorLogin.css'; // Make sure this CSS file exists

// Debug: Check if modules are imported
console.log('[CollectorLogin] axiosInstance imported:', !!axiosInstance);
console.log('[CollectorLogin] API_ENDPOINTS imported:', API_ENDPOINTS ? 'Object received' : 'UNDEFINED');
console.log('[CollectorLogin] useAuth imported:', !!useAuth);
if (API_ENDPOINTS) {
    console.log('[CollectorLogin] API_ENDPOINTS.AUTH.LOGIN:', API_ENDPOINTS.AUTH?.LOGIN);
}


const CollectorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoggedIn && auth.userInfo?.role === 'collector') {
      console.log("[CollectorLogin] Already logged in as collector. Redirecting to dashboard.");
      navigate('/collector-dashboard'); // Or your collector's main page
    } else if (auth.isLoggedIn && auth.userInfo?.role) {
      // If logged in but not as a collector, you might want to redirect them away
      // from the collector login page, e.g., to their own dashboard or home.
      console.log(`[CollectorLogin] User logged in as ${auth.userInfo.role}, not collector. Redirecting from collector login.`);
      // navigate('/'); // Example: redirect to home
    }
  }, [auth.isLoggedIn, auth.userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    // Defensive check for API_ENDPOINTS before making the call
    if (typeof API_ENDPOINTS === 'undefined' || !API_ENDPOINTS?.AUTH?.LOGIN) {
        console.error("[CollectorLogin handleSubmit] CRITICAL: API_ENDPOINTS or API_ENDPOINTS.AUTH.LOGIN is not defined. Check import and apiConfig.js.", API_ENDPOINTS);
        setError("Configuration error: Login endpoint is missing. Please contact support.");
        setLoading(false);
        return;
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

      if (response.data?.success && response.data?.token && response.data?.data) {
        if (response.data.data.role === 'collector') {
          console.log("[CollectorLogin] Login successful for collector:", response.data.data.email);
          auth.login(response.data.token, response.data.data);
          // App.jsx will handle redirection based on the updated auth state
        } else {
          console.warn("[CollectorLogin] Credentials are valid, but user is not a collector. Role:", response.data.data.role);
          setError('These credentials do not belong to a collector account.');
          // If a non-collector logs in here, the token is still set.
          // App.jsx's redirection logic should handle sending them to the correct place.
        }
      } else {
        setError(response.data?.message || 'Login failed: Unexpected response from server.');
      }
    } catch (err) {
      console.error('Collector Login Error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        setError('Network error or server is unreachable. Please try again later.');
      } else {
        setError('An unexpected error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  // If API_ENDPOINTS is undefined here, it means the import totally failed.
  if (typeof API_ENDPOINTS === 'undefined') {
    return (
        <div className="RegCollect-container error-state">
             <div className="RegCollect-card">
                <h2>Configuration Error</h2>
                <p className="RegCollect-error" style={{backgroundColor: '#ffdddd', border: '1px solid red', padding: '15px', borderRadius: '5px'}}>
                    CRITICAL: The API configuration (API_ENDPOINTS) could not be loaded in CollectorLogin.jsx.
                    This is due to an incorrect import path for <strong>apiConfig.js</strong>.
                    Vite error: "Failed to resolve import".
                </p>
                <p><strong>Please check the import path for <code>apiConfig.js</code> (and <code>axiosInstance.js</code>, <code>App.jsx</code>) at the top of this file (<code>CollectorLogin.jsx</code>) and correct it based on your project's actual file structure.</strong></p>
            </div>
        </div>
    );
  }


  return (
    <div className="RegCollect-container"> {/* Using RegCollect- for styling consistency with CollectorForm */}
      <div className="RegCollect-card">
        <h2>Collector Login</h2>
        <p>Access your collector dashboard</p>

        {error && <div className="RegCollect-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="RegCollect-formGroup">
            <label htmlFor="collector-email">Email</label>
            <input
              type="email"
              id="collector-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collector@example.com"
              required
              autoComplete="email"
              className="RegCollect-input"
              disabled={loading}
            />
          </div>

          <div className="RegCollect-formGroup">
            <label htmlFor="collector-password">Password</label>
            <input
              type="password"
              id="collector-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="RegCollect-input"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="RegCollect-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="RegCollect-footer">
          {/* <Link to="/collector-forgot-password" className="RegCollect-link">Forgot password?</Link> */}
          <span>Don't have an account? <Link to="/CollectorForm" className="RegCollect-link">Register</Link></span>
        </div>
      </div>
    </div>
  );
};

export default CollectorLogin;