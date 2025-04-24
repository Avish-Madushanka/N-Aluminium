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
  const navigate = useNavigate();                 // Hook for programmatic navigation (used for Admin)

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

    // --- Frontend check for Admin email ---
    // NOTE: Password validation is still done ONLY by the backend.
    const isAdminEmailEntered = email === 'Admin@gmail.com';

    try {
      // --- API Call using Axios ---
      const response = await axios.post(
        apiUrl,
        { email, password }, // Data payload sent to the backend
        { headers: { 'Content-Type': 'application/json' } } // Specify content type
      );

      // --- Handle Successful API Response ---
      // Check if backend indicates success and provides a token
      if (response.data && response.data.success && response.data.token) {

        // --- Special Handling for Admin Login ---
        if (isAdminEmailEntered) {
          // This block executes ONLY if the entered email was the admin's
          // AND the backend successfully authenticated the credentials.
          console.log('Admin login successful (Backend Verified). Redirecting to /Admin...');
          setSuccess('Admin login successful! Redirecting...'); // Show success message

          // Store token and user info locally for the admin session
          localStorage.setItem('token', response.data.token);
          // Store the full user data object returned by the backend
          localStorage.setItem('userInfo', JSON.stringify(response.data.data));

          // Directly navigate the admin after a short delay
          setTimeout(() => {
            navigate('/Admin', { replace: true }); // Redirect to Admin Dashboard
          }, 1000); // 1-second delay to allow user to see the success message

        } else {
          // --- Handling for Regular Users (Client or BOwner) ---
          const receivedUserType = response.data.data?.userType || 'unknown'; // Get type from response data
          console.log(`Login successful as ${receivedUserType}:`, response.data);
          setSuccess('Login successful! Redirecting...'); // Show success message

          // *** Call the callback function passed from App.jsx ***
          // This delegates token storage, state update, and navigation logic to the parent
          onLoginSuccess(response.data.token);
        }

      } else {
        // Handle cases where the API call succeeded (status 2xx) but the backend logic failed
        // or returned an unexpected format (e.g., success: false, or missing token)
        console.error("Login API success, but invalid data received:", response.data);
        throw new Error(response.data?.message || 'Login failed: Invalid response from server.');
      }
    } catch (err) {
      // --- Handle API Call Errors ---
      setLoading(false); // Ensure loading stops on error

      console.error("Login error encountered:", err); // Log the full error object
      let errorMessage = 'An unknown error occurred during login.'; // Default error message

      if (err.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        console.error("Server Error Response:", err.response.status, err.response.data);
        // Use the error message from the backend response if available
        errorMessage = err.response.data?.message || `Login failed (${err.response.status}). Please check your credentials.`;
      } else if (err.request) {
        // The request was made but no response was received (e.g., network issue, server down)
        console.error("No response received:", err.request);
        errorMessage = 'Network Error: Could not connect to the server. Please check your connection or try again later.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request Setup Error:', err.message);
        errorMessage = `An unexpected error occurred: ${err.message}`;
      }
      setError(errorMessage); // Set the error state to display the message to the user
    }
    // setLoading(false) is primarily needed in the catch block.
    // In success cases, navigation will typically unmount the component or change state causing re-render.
  };

  // --- JSX Rendering ---
  return (
    <div className="login-container"> {/* Main container for the login page */}
      <div className="login-content"> {/* Container for the two sections */}

        {/* Left Section (Informational/Branding) */}
        <div className="left-section">
          <h1 className="welcome-title">Welcome</h1>
          <p className="subtitle">
             Log in to access your N-Aluminium account. Manage pickups, track history, and contribute to sustainable practices.
          </p>
          {/* Placeholder social icons */}
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        {/* Right Section (Login Form) */}
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>

          {/* Display Error and Success Messages */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                autoComplete="email" // Helps browser autofill
                required // HTML5 validation
                disabled={loading} // Disable input while loading
              />
            </div>

            {/* Password Input Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                autoComplete="current-password" // Helps browser autofill
                required // HTML5 validation
                disabled={loading} // Disable input while loading
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="signin-button"
              disabled={loading} // Disable button while loading
            >
              {/* Show different text based on loading state */}
              {loading ? 'Signing in...' : 'Sign in now'}
            </button>
          </form>

          {/* Terms and Policy Links */}
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