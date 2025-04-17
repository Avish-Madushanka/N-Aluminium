import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  // State Variables - Remove userType state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // No userType state needed anymore
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Clear messages on component unmount
  useEffect(() => {
    return () => {
      setError('');
      setSuccess('');
    };
  }, []);

  // --- Event Handlers ---
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  // No handleUserTypeChange needed anymore

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // --- Use the single unified login endpoint ---
    const apiUrl = 'http://localhost:5002/api/auth/login'; // *** Use the new unified route ***

    try {
      // --- API Call ---
      const response = await axios.post(
        apiUrl,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // --- Success Handling ---
      // Check structure AND the userType returned from backend
      if (response.data && response.data.success && response.data.token && response.data.data?.userType) {

        const receivedUserType = response.data.data.userType; // Get type from response
        const tokenKey = receivedUserType === 'client' ? 'clientToken' : 'bOwnerToken';
        const infoKey = receivedUserType === 'client' ? 'clientInfo' : 'bOwnerInfo';
        // *** Adjust redirect paths as needed ***
        const redirectPath = receivedUserType === 'client' ? '/' : '/BOwnerHome';

        console.log(`Login successful as ${receivedUserType}:`, response.data); // Log success

        // Store token and user info using type-specific keys
        localStorage.setItem(tokenKey, response.data.token);
        localStorage.setItem(infoKey, JSON.stringify(response.data.data));

        setSuccess('Login successful! Redirecting...');

        // Navigate after delay
        setTimeout(() => {
          navigate(redirectPath); // Redirect to appropriate path
        }, 1500);

      } else {
        // Handle unexpected success response format
        console.error("Login succeeded but received unexpected or incomplete data:", response.data);
        setError('Login failed: Invalid response from server.');
        setLoading(false);
      }
    } catch (err) {
      // --- Error Handling ---
      setLoading(false); // Stop loading on error

      console.error("Login error!");
      if (err.response) {
        console.error("Server Response:", err.response.status, err.response.data);
        setError(err.response.data?.message || `Login failed (${err.response.status}). Please check credentials.`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError('Network Error: Unable to reach server.');
      } else {
        console.error('Request Setup Error:', err.message);
        setError(`An error occurred: ${err.message}`);
      }
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
            <a href="#" className="social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {/* --- Title is now static --- */}
          <h2 className="signin-title">Sign in</h2>

          {/* Feedback Messages */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* --- User Type Selection REMOVED --- */}

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
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