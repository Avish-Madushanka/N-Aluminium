const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// Determine the absolute root of the backend server.
// This is useful for pings or other non-/api prefixed routes if needed.
let BACKEND_SERVER_ROOT = API_BASE_URL;
if (API_BASE_URL.endsWith('/api')) {
    BACKEND_SERVER_ROOT = API_BASE_URL.substring(0, API_BASE_URL.length - '/api'.length);
} else {
    // If API_BASE_URL doesn't end with /api, it might already be the root or something else.
    // This assumes if /api is not present, then API_BASE_URL is the root.
    // For example, if VITE_API_BASE_URL was 'http://localhost:5003', BACKEND_SERVER_ROOT would also be 'http://localhost:5003'.
    console.warn(
        `[apiConfig] API_BASE_URL ("${API_BASE_URL}") does not end with "/api". ` +
        `BACKEND_SERVER_ROOT will be the same as API_BASE_URL. ` +
        `Ensure this is intended for root pings.`
    );
}

const API_ENDPOINTS = {
  // The base URL for most API calls (e.g., http://localhost:5003/api)
  API_BASE_URL: API_BASE_URL,

  // The absolute root URL of the backend server (e.g., http://localhost:5003)
  BACKEND_SERVER_ROOT: BACKEND_SERVER_ROOT,

  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    // GET_ME: `${API_BASE_URL}/auth/me`, // Example for a unified "get current user" endpoint
  },

  // Client-specific endpoints
  CLIENTS: {
    REGISTER: `${API_BASE_URL}/clients/register`,
    // GET_MY_PROFILE: `${API_BASE_URL}/clients/me`, // Example for client-specific profile
  },

  // Business Owner-specific endpoints
  BOWNERS: {
    REGISTER: `${API_BASE_URL}/b-owners/register`, // Matches your backend route path in app.js
    // GET_MY_PROFILE: `${API_BASE_URL}/b-owners/me`, // Example for BOwner-specific profile
  },

  // Admin specific endpoints (example for calendar settings)
  ADMIN: {
    SETTINGS: `${API_BASE_URL}/calendar-settings`, // Assuming this is the correct path for your backend
  },

  // Review endpoints
  REVIEWS: {
    CREATE: `${API_BASE_URL}/reviews`,
    GET_ALL: `${API_BASE_URL}/reviews`, // Endpoint to fetch (approved) reviews
  },

  // You can add more top-level categories for other resources:
  // BOOKINGS: { ... },
  // MATERIALS: { ... },
  // SALE_ITEMS: { ... },
};

// Log the configured URLs for easier debugging during development
if (import.meta.env.DEV) { // Only log in development mode for Vite
    console.log('[apiConfig] Final API_BASE_URL set to:', API_ENDPOINTS.API_BASE_URL);
    console.log('[apiConfig] Final BACKEND_SERVER_ROOT set to:', API_ENDPOINTS.BACKEND_SERVER_ROOT);
}


export default API_ENDPOINTS;