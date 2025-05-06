/**
 * Central configuration for API endpoints
 * All components should import URLs from this file to ensure consistency
 */

// Detect environment - force dev mode on localhost
const isDevelopment = process.env.NODE_ENV === 'development' || 
                      !process.env.NODE_ENV || 
                      window.location.hostname === 'localhost';

// Configuration - can be overridden by environment variables
const API_PORT = window.API_PORT || 5003; // Default port
const API_HOST = window.API_HOST || 'localhost';
const API_BASE = `http://${API_HOST}:${API_PORT}`;

// Fallback configuration in case primary port doesn't respond
const FALLBACK_PORTS = [5002, 5001, 3000];

// For development, we'll skip API checks entirely
const SKIP_API_CHECKS = isDevelopment;

// Admin credentials - hardcoded and visible for direct access
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

/**
 * Utility function to check if the API is reachable
 * @param {string} url - The URL to check
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} True if API is reachable
 */
const checkApiStatus = async (url = `${API_BASE}/api/health`, timeout = 3000) => {
  // Always return true in development to avoid errors
  if (SKIP_API_CHECKS) {
    console.log("Development mode - Skipping API check");
    return true;
  }
  
  try {
    // Try a more general health endpoint that's more likely to exist
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
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
      // If the health endpoint fails, try a more common endpoint
      const alternateUrl = `${API_BASE}/api/auth/login`;
      const response = await fetch(alternateUrl, { 
        method: 'OPTIONS',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      return true;
    }
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
  // Skip port checking in development
  if (SKIP_API_CHECKS) {
    console.log("Development mode - Skipping port check");
    return API_PORT; // Return default port
  }
  
  for (const port of ports) {
    const testUrl = `http://${API_HOST}:${port}/api/health`;
    const altTestUrl = `http://${API_HOST}:${port}/api/auth/login`;
    
    try {
      // Try the health endpoint first
      const isWorking = await checkApiStatus(testUrl);
      if (isWorking) {
        console.log(`Found working API on port ${port}`);
        return port;
      }
      
      // If health endpoint doesn't work, try the login endpoint
      const response = await fetch(altTestUrl, { 
        method: 'OPTIONS',
        cache: 'no-cache',
        timeout: 2000
      });
      if (response) {
        console.log(`Found working API on port ${port} (login endpoint)`);
        return port;
      }
    } catch (err) {
      // Continue to next port
      console.log(`Port ${port} not responding`);
    }
  }
  return null;
};

/**
 * Verify a JWT token client-side
 * @param {string} token - The JWT token to verify
 * @returns {boolean} True if the token appears valid
 */
const verifyTokenClientSide = (token) => {
  // In development mode, always consider the token valid
  if (SKIP_API_CHECKS && isDevelopment) {
    console.log("Development mode - Skipping token verification");
    return true;
  }
  
  if (!token || token === 'undefined' || token === 'null') {
    return false;
  }
  
  try {
    // Simple structure validation - JWT should have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    // Decode the JWT payload (second part) - this doesn't verify signature
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.error("Token has expired");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return false;
  }
};

// API endpoints used throughout the application
const API_ENDPOINTS = {
  // Base URLs
  BASE: API_BASE,
  API_ROOT: `${API_BASE}/api`,

  // Admin credentials - accessible throughout the app
  ADMIN_CREDENTIALS: ADMIN_CREDENTIALS,

  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE}/api/auth/login`,
    VERIFY: `${API_BASE}/api/auth/verify`,
    LOGOUT: `${API_BASE}/api/auth/logout`,
  },

  // Admin endpoints
  ADMIN: {
    SETTINGS: `${API_BASE}/api/settings`,
    DASHBOARD: `${API_BASE}/api/admin/dashboard`,
    USERS: `${API_BASE}/api/admin/users`,
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
  
  // Constants for development
  DEV: {
    IS_DEVELOPMENT: isDevelopment,
    HAS_QUICK_LOGIN: true, // Flag to indicate quick login is available
    // Expose admin credentials for easy access in development mode
    ADMIN_EMAIL: ADMIN_CREDENTIALS.email,
    ADMIN_PASSWORD: ADMIN_CREDENTIALS.password
  },
  
  // Utility functions
  utils: {
    checkApiStatus,
    findWorkingPort,
    verifyTokenClientSide,
    
    // Function to retry with fallback ports if primary port fails
    tryWithFallbacks: async (apiCall, fallbackPorts = FALLBACK_PORTS) => {
      // In development with no backend, don't even try the API call
      if (SKIP_API_CHECKS && isDevelopment) {
        throw new Error('DEV_MODE_NO_BACKEND');
      }
      
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
    },
    
    // Modified for hardcoded admin login - uses visible credentials
    quickDevLogin: async () => {
      console.warn('Using hardcoded admin login credentials');
      
      // Create a dev token that will expire in 1 hour
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        sub: 'admin-user',
        name: 'Admin User',
        role: 'admin',
        email: ADMIN_CREDENTIALS.email, 
        exp: now + 3600 // 1 hour from now
      };
      
      // Create a simple JWT-like token (NOT SECURE - only for development)
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payloadStr = btoa(JSON.stringify(payload));
      const signature = btoa('dev-signature'); // Not a real signature
      
      const token = `${header}.${payloadStr}.${signature}`;
      
      // Return a mock response similar to what the backend would return
      return {
        data: {
          success: true,
          token,
          data: {
            _id: 'admin-user-id',
            email: ADMIN_CREDENTIALS.email,
            name: 'Admin User',
            role: 'admin',
            userType: 'admin'
          }
        }
      };
    },
    
    // Check if credentials match admin credentials
    isAdminUser: (email, password) => {
      return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
    }
  }
};

export default API_ENDPOINTS; 