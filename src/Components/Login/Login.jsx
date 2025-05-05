import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use navigate for admin redirect
import './Login.css'; // Ensure this CSS file exists and is correctly styled

// Accept onLoginSuccess prop from App.jsx
function Login({ onLoginSuccess }) {
  // --- State Variables ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState('');       // Error message display
  const [success, setSuccess] = useState('');     // Success message display
  const navigate = useNavigate();                 // Hook for programmatic navigation

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
    setLoading(true);   // Set loading state to true
    setError('');       // Clear any previous errors
    setSuccess('');     // Clear any previous success messages

    // Backend API endpoint for unified login
    const apiUrl = 'http://localhost:5002/api/auth/login'; // Adjust if your port/URL differs

    try {
      // --- API Call using Axios ---
      const response = await axios.post(
        apiUrl,
        { email, password }, // Data payload sent to the backend
        { headers: { 'Content-Type': 'application/json' } } // Specify content type
      );

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
          
          // Direct navigation to Admin dashboard for admin users
          setTimeout(() => {
            navigate('/Admin', { replace: true });
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
        errorMessage = err.response.data?.message || `Login failed (${err.response.status}). Please check your credentials.`;
      } else if (err.request) {
        // Request was made but no response was received
        console.error("No response received:", err.request);
        errorMessage = 'Network Error: Could not connect to the server. Please check your connection or try again later.';
      } else {
        // Error setting up the request
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
              disabled={loading}
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