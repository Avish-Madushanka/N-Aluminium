/**
 * Central configuration for API endpoints
 * All components should import URLs from this file to ensure consistency
 */

// Configuration - can be overridden by environment variables
const API_PORT = window.API_PORT || 5003; // Default port
const API_HOST = window.API_HOST || 'localhost';
const API_BASE = `http://${API_HOST}:${API_PORT}`;

// Fallback configuration in case primary port doesn't respond
const FALLBACK_PORTS = [5002, 5001, 3000];

/**
 * Utility function to check if the API is reachable
 * @param {string} url - The URL to check
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} True if API is reachable
 */
const checkApiStatus = async (url = `${API_BASE}/api/auth/verify`, timeout = 3000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      method: 'GET',
      signal: controller.signal,
      // We only care if the server responds, not about the response content
      cache: 'no-cache',
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    return true; // If we get any response, the API is reachable
  } catch (error) {
    console.warn(`API endpoint ${url} is not reachable:`, error.message);
    return false;
  }
};

/**
 * Attempt to find a working API port
 * @param {Array} ports - Array of ports to try
 * @returns {Promise<number|null>} The working port or null if none found
 */
const findWorkingPort = async (ports = FALLBACK_PORTS) => {
  for (const port of ports) {
    const testUrl = `http://${API_HOST}:${port}/api/auth/verify`;
    const isWorking = await checkApiStatus(testUrl);
    if (isWorking) {
      console.log(`Found working API on port ${port}`);
      return port;
    }
  }
  return null;
};

// API endpoints used throughout the application
const API_ENDPOINTS = {
  // Base URLs
  BASE: API_BASE,
  API_ROOT: `${API_BASE}/api`,

  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE}/api/auth/login`,
    VERIFY: `${API_BASE}/api/auth/verify`,
  },

  // Admin endpoints
  ADMIN: {
    SETTINGS: `${API_BASE}/api/settings`,
  },

  // User endpoints
  CLIENTS: {
    REGISTER: `${API_BASE}/api/clients/register`,
    PROFILE: `${API_BASE}/api/clients/profile`,
  },

  // Business owner endpoints
  BOWNERS: {
    REGISTER: `${API_BASE}/api/bowners/register`,
    PROFILE: `${API_BASE}/api/bowners/profile`,
  },

  // Sales endpoints
  SALES: {
    CREATE: `${API_BASE}/api/saleitems`,
  },

  // File URLs - for image paths returned from backend
  FILES: {
    getImageUrl: (path) => path ? `${API_BASE}${path}` : null,
  },
  
  // Utility functions
  utils: {
    checkApiStatus,
    findWorkingPort,
    
    // Function to retry with fallback ports if primary port fails
    tryWithFallbacks: async (apiCall, fallbackPorts = FALLBACK_PORTS) => {
      try {
        return await apiCall(); // Try with primary port first
      } catch (error) {
        if (error.message?.includes('ECONNREFUSED') || error.message?.includes('Network Error')) {
          console.warn('Primary API port failed, trying fallbacks...');
          const workingPort = await findWorkingPort(fallbackPorts);
          
          if (workingPort) {
            console.log(`Using fallback port ${workingPort}`);
            window.API_PORT = workingPort; // Set the working port for future calls
            return await apiCall(); // Retry with the new port
          }
        }
        throw error; // Re-throw if no fallbacks work or for other errors
      }
    }
  }
};

export default API_ENDPOINTS; 