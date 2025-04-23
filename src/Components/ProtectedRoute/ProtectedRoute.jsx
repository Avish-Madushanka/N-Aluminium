import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const location = useLocation(); // Get current location to redirect back after login
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  let isTokenExpired = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Get time in seconds

      if (decoded.exp > currentTime) {
        isAuthenticated = true; // Token exists and is not expired
      } else {
        isTokenExpired = true; // Token exists but is expired
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // Treat decoding error as unauthenticated (invalid token)
      isAuthenticated = false;
      // Optionally remove the bad token
      localStorage.removeItem('token');
      localStorage.removeItem('userId'); // Also clear userId if you store it
    }
  }

  // If token expired, clear it before redirecting
  if (isTokenExpired) {
     console.log("Token expired, logging out.");
     localStorage.removeItem('token');
     localStorage.removeItem('userId');
     isAuthenticated = false; // Ensure state reflects logout
  }


  if (!isAuthenticated) {
    // Redirect them to the /Login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    console.log(`ProtectedRoute: Not authenticated, redirecting to /Login from ${location.pathname}`);
    return <Navigate to="/Login" state={{ from: location }} replace />;
    // 'replace' avoids adding the login route to the history stack when redirecting.
  }

  // If authenticated, render the child component (e.g., <UserCalendar />)
  return children;
};

export default ProtectedRoute; // Make sure to export it