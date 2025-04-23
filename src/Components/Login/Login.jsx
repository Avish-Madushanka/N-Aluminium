import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Remove useNavigate from here, navigation is handled by App.js via onLoginSuccess
// import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure this CSS file exists and is styled

// Accept onLoginSuccess as a prop
function Login({ onLoginSuccess }) {
  // State Variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Remove navigate as it's handled by the prop
  // const navigate = useNavigate();

  // Clear messages on component mount or when props change (optional)
  useEffect(() => {
    return () => {
      setError('');
      setSuccess('');
    };
  }, []);

  // --- Event Handlers ---
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(''); // Clear previous success message

    const apiUrl = 'http://localhost:5002/api/auth/login'; // Unified login endpoint

    try {
      // --- API Call ---
      const response = await axios.post(
        apiUrl,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // --- Success Handling ---
      // Check for standard success response and token
      if (response.data && response.data.success && response.data.token) {
        const receivedUserType = response.data.data?.userType || 'unknown'; // Get user type if available
        console.log(`Login successful as ${receivedUserType}:`, response.data); // Log success

        setSuccess('Login successful! Redirecting...');

        // *** CRITICAL CHANGE: Call the onLoginSuccess prop ***
        // Pass the token to the App component to handle state update, storage, and navigation
        onLoginSuccess(response.data.token);

        // Do NOT navigate directly from here anymore.
        // setTimeout(() => {
        //   navigate(redirectPath);
        // }, 1500);

      } else {
        // Handle unexpected success response format
        console.error("Login succeeded but received unexpected or incomplete data:", response.data);
        throw new Error(response.data?.message || 'Login failed: Invalid response from server.'); // Throw error to be caught below
      }
    } catch (err) {
      // --- Error Handling ---
      setLoading(false); // Stop loading on error

      console.error("Login error!");
      let errorMessage = 'An unknown error occurred during login.'; // Default message
      if (err.response) {
        // Error response from server (e.g., 400, 401, 500)
        console.error("Server Response:", err.response.status, err.response.data);
        errorMessage = err.response.data?.message || `Login failed (${err.response.status}). Please check credentials.`;
      } else if (err.request) {
        // No response received from server
        console.error("No response received:", err.request);
        errorMessage = 'Network Error: Unable to reach the server. Please check your connection.';
      } else {
        // Error setting up the request or other client-side error
        console.error('Request Setup/Other Error:', err.message);
        errorMessage = `An error occurred: ${err.message}`;
      }
      setError(errorMessage);
    }
    // Removed finally block setting loading=false, as success case now relies on navigation triggered by parent
  };

  // --- JSX Rendering (Structure mostly unchanged) ---
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
            {/* Add actual links or functionality if needed */}
            <a href="#" className="social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>

          {/* Feedback Messages */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com" // Added placeholder
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password" // Added placeholder
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="signin-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in now'}
            </button>
          </form>

          {/* Terms */}
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