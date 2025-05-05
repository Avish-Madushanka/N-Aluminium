/**
 * Authentication utilities for the application
 */
import { jwtDecode } from 'jwt-decode';
import API_ENDPOINTS from '../apiConfig';

/**
 * Checks if a JWT token is valid and not expired
 * @param {string} token - The JWT token to validate
 * @param {number} bufferSeconds - Extra time buffer in seconds to consider valid
 * @returns {boolean} Whether the token is valid
 */
export const isTokenValid = (token, bufferSeconds = 30) => {
  if (!token) return false;
  
  try {
    // Extract payload
    const decoded = jwtDecode(token);
    
    // Check expiration with buffer to account for clock differences
    if (!decoded.exp) return false;
    
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() < (expirationTime + (bufferSeconds * 1000)); 
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

/**
 * Redirect to login page with current URL as redirect parameter
 * @param {boolean} expired - Whether the token has expired 
 */
export const redirectToLogin = (expired = false) => {
  const currentUrl = window.location.pathname;
  const queryParams = new URLSearchParams();
  
  // Add redirect path to URL
  queryParams.append('redirect', currentUrl);
  
  // Add token expired flag if needed
  if (expired) {
    queryParams.append('tokenExpired', 'true');
  }
  
  window.location.href = `/Login?${queryParams.toString()}`;
};

/**
 * Check authentication status and redirect if not authenticated
 * @returns {Object|null} User info if authenticated, null if not
 */
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    redirectToLogin();
    return null;
  }
  
  if (!isTokenValid(token)) {
    // Token exists but is invalid/expired
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    redirectToLogin(true); // Indicate token expired
    return null;
  }
  
  // Token is valid, return user info
  try {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      return JSON.parse(storedUserInfo);
    }
    
    // If user info not in localStorage, decode from token
    const decoded = jwtDecode(token);
    return {
      id: decoded.id || null,
      name: decoded.name || decoded.ownerName || 'User',
      email: decoded.email || null,
      userType: decoded.userType || 'unknown',
      role: decoded.role || 'user',
    };
  } catch (error) {
    console.error("Error parsing user info:", error);
    return null;
  }
};

export default {
  isTokenValid,
  redirectToLogin,
  checkAuth
}; 