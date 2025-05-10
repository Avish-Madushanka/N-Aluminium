// apiConfig.js
const moduleApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

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
  API_ROOT: moduleApiBaseUrl, // Use this for your UserCalendar.jsx
  CLIENT: {
    REGISTER: `${moduleApiBaseUrl}/clients/register`,
  },
  BOWNERS: {
    REGISTER: `${moduleApiBaseUrl}/b-owners/register`,
  },
  CALENDAR_SETTINGS: {
    GET: `${moduleApiBaseUrl}/calendar-settings`,
    UPDATE: `${moduleApiBaseUrl}/calendar-settings`,
  },
  AUTH: {
    LOGIN: `${moduleApiBaseUrl}/auth/login`,
  },
  BOOKINGS: {
    CREATE: `${moduleApiBaseUrl}/bookings`,
  },
  // You might still need BACKEND_ROOT_URL if other parts of your app use it without the /api suffix
  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', '')
};

// Log the configured URLs for easier debugging during development
if (import.meta.env.DEV) { // Only log in development mode for Vite
    console.log('[apiConfig] Final API_BASE_URL set to:', API_ENDPOINTS.API_BASE_URL);
    console.log('[apiConfig] Final BACKEND_SERVER_ROOT set to:', API_ENDPOINTS.BACKEND_SERVER_ROOT);
}


export default API_ENDPOINTS;