import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import API_ENDPOINTS from '../../apiConfig';
import './Login.css';

// Accept onLoginSuccess prop from App.jsx
function Login({ onLoginSuccess }) {
  // --- State Variables ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverStatus, setServerStatus] = useState('unknown'); // unknown, online, offline
  const navigate = useNavigate();
  const location = useLocation(); // Added to handle redirect after login

  // Check for redirect parameter in URL
  useEffect(() => {
    // Clear any potentially invalid tokens on mount
    const params = new URLSearchParams(location.search);
    const redirectPath = params.get('redirect');
    
    // If we detect a forced logout or invalid token situation
    if (params.get('tokenExpired') === 'true') {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      setError('Your session has expired. Please log in again.');
    }

    // Check backend status
    checkBackendStatus();
  }, [location.search]);

  // Check if the backend server is running
  const checkBackendStatus = async () => {
    try {
      // Use the utility function from apiConfig to check server status
      const isOnline = await API_ENDPOINTS.utils.checkApiStatus();
      
      if (isOnline) {
        setServerStatus('online');
        setError(''); // Clear any previous connection errors
        return true;
      }
      
      // If primary port is not working, try fallback ports
      console.log("Primary API port not responding, checking fallback ports...");
      const workingPort = await API_ENDPOINTS.utils.findWorkingPort();
      
      if (workingPort) {
        console.log(`Found backend server on port ${workingPort}`);
        window.API_PORT = workingPort; // Set the working port globally
        setServerStatus('online');
        setError(`Found backend server on port ${workingPort} instead of port 5003.`);
        return true;
      }
      
      // No working port found
      setServerStatus('offline');
      setError('Connection to server failed. Please ensure the backend server is running on port 5003.');
      return false;
    } catch (err) {
      console.error("Backend status check failed:", err);
      setServerStatus('offline');
      setError('Connection to server failed. Please ensure the backend server is running on port 5003.');
      return false;
    }
  };

  // --- Effect to clear messages on unmount ---
  useEffect(() => {
    // Cleanup function runs when component unmounts
    return () => {
      setError('');
      setSuccess('');
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // --- Event Handlers ---
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // --- Form Submission Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Don't try to login if server is offline
    if (serverStatus === 'offline') {
      setError("Cannot login: Backend server is offline. Please make sure it's running on port 5003.");
      return;
    }
    
    setLoading(true);   // Set loading state to true
    setError('');       // Clear any previous errors
    setSuccess('');     // Clear any previous success messages

    // Get login URL from centralized config
    const apiUrl = API_ENDPOINTS.AUTH.LOGIN;

    try {
      // Use the tryWithFallbacks utility to attempt login with fallback ports if needed
      const response = await API_ENDPOINTS.utils.tryWithFallbacks(async () => {
        return await axios.post(
          apiUrl,
          { email, password }, // Data payload sent to the backend
          { 
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000 // Increase timeout to 5 seconds
          } 
        );
      });

      // --- Handle Successful API Response ---
      // Check if backend indicates success and provides a token and user data
      if (response.data && response.data.success && response.data.token && response.data.data) {
        const userData = response.data.data; // Get the user data object from the response
        const userRole = userData.role;     // Get the user's role (as determined by the backend)
        const userType = userData.userType; // Get the user's type (client/bowner)

        // Store token and user info in localStorage for future use
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(userData));

        // *** Determine Action Based on Role Returned by Backend ***
        if (userRole === 'admin') {
          // --- Handling for Admin Login (Hardcoded credentials verified by backend) ---
          console.log('Admin login successful. Redirecting to admin dashboard...');
          setSuccess('Admin login successful! Redirecting to dashboard...');
          
          // Check if there's a redirect parameter in the URL (from a session expiration)
          const params = new URLSearchParams(location.search);
          const redirectPath = params.get('redirect');
          
          // Direct navigation to requested page or Admin dashboard for admin users
          setTimeout(() => {
            navigate(redirectPath || '/Admin', { replace: true });
          }, 1000);
        } else {
          // --- For regular users (client or business owner), use the provided callback ---
          console.log(`Login successful as ${userType} (Role: ${userRole})`);
          setSuccess('Login successful! Redirecting...');
          
          // Call the callback passed from App.jsx (which will handle navigation)
          onLoginSuccess(response.data.token, userData);
        }
      } else {
        // Handle cases where the API call succeeded but the backend logic failed
        console.error("Login API success, but invalid data received:", response.data);
        throw new Error(response.data?.message || 'Login failed: Invalid response from server.');
      }
    } catch (err) {
      // --- Handle API Call Errors ---
      setLoading(false); // Ensure loading stops on error

      console.error("Login error encountered:", err); // Log the full error object
      let errorMessage = 'An unknown error occurred during login.'; // Default error message

      if (err.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Server Error Response:", err.response.status, err.response.data);
        
        // Handle specific status codes with more useful messages
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.response.status === 403) {
          errorMessage = 'Account access forbidden. Please contact an administrator.';
        } else if (err.response.status >= 500) {
          errorMessage = 'Server error occurred. Please try again later or contact support.';
          setServerStatus('error'); // Mark server as having issues
        } else {
          // Use server provided message or fallback to generic message with status code
          errorMessage = err.response.data?.message || `Login failed (${err.response.status}). Please check your credentials.`;
        }
      } else if (err.request) {
        // Request was made but no response was received - likely a network or server issue
        console.error("No response received:", err.request);
        setServerStatus('offline');
        
        // Check for specific network error types
        if (err.message.includes('Network Error')) {
          errorMessage = 'Network Error: Could not connect to the server. Please check your internet connection and verify the backend server is running on port 5003.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timed out. The server may be experiencing high load or connectivity issues.';
        } else if (err.message.includes('ECONNREFUSED')) {
          errorMessage = 'Connection refused: The backend server is not running or not accessible on port 5003. Please start the backend server.';
        } else {
          errorMessage = 'Network Error: Could not connect to the server. Please check that the backend server is running on port 5003.';
        }
      } else {
        // Error setting up the request - likely a client-side issue
        console.error('Request Setup Error:', err.message);
        errorMessage = `An unexpected error occurred: ${err.message}`;
      }
      
      setError(errorMessage); // Display error message
    } finally {
      setLoading(false); // Always ensure loading stops, whether success or error
    }
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
             {/* Add actual icons/links if needed */}
            <a href="#" className="social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>

          {serverStatus === 'offline' && (
            <div className="warning-message" style={{backgroundColor: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>
              <div style={{fontWeight: 'bold', marginBottom: '5px'}}>⚠️ Backend server appears to be offline</div>
              <div style={{fontSize: '0.9em'}}>
                Please make sure the backend server is running on port 5003 by:
                <ul style={{marginTop: '5px', paddingLeft: '20px'}}>
                  <li>Run <code>fix-and-start-backend.bat</code> file, or</li>
                  <li>Run <code>npm run fix:backend</code> in terminal</li>
                </ul>
                <div style={{marginTop: '5px', fontStyle: 'italic'}}>
                  The backend requires MongoDB connection. Check the README.md for setup instructions.
                </div>
              </div>
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
              disabled={loading || serverStatus === 'offline'}
            >
              {loading ? 'Signing in...' : 'Sign in now'}
            </button>
          </form>

          <div className="terms">
            By clicking on "Sign in now" you agree to <br />
            <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;