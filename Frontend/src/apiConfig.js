// apiConfig.js
const moduleApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// Determine the absolute root of the backend server.
// This is useful for pings or other non-/api prefixed routes if needed.
let derivedBackendServerRoot; // Changed variable name for clarity and to avoid conflict if API_ENDPOINTS.BACKEND_ROOT_URL was meant to be the definitive one.

if (moduleApiBaseUrl.endsWith('/api')) {
    derivedBackendServerRoot = moduleApiBaseUrl.substring(0, moduleApiBaseUrl.length - '/api'.length);
} else {
    // If moduleApiBaseUrl doesn't end with /api, it might already be the root or something else.
    // This assumes if /api is not present, then moduleApiBaseUrl is the root.
    derivedBackendServerRoot = moduleApiBaseUrl; // Assign it directly
    console.warn(
        `[apiConfig] moduleApiBaseUrl ("${moduleApiBaseUrl}") does not end with "/api". ` +
        `derivedBackendServerRoot will be the same as moduleApiBaseUrl. ` +
        `Ensure this is intended for root pings.`
    );
}

const API_ENDPOINTS = {
  API_ROOT: moduleApiBaseUrl, // This is your primary base for API calls
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
  // This version of BACKEND_ROOT_URL is more robust as it directly uses the env var or fallback
  // and explicitly removes '/api'. This is likely what you want for the Login component's server check.
  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', '')
  // If you needed the derivedBackendServerRoot for some other specific purpose, you could add it:
  // DERIVED_SERVER_ROOT_FOR_PING: derivedBackendServerRoot,
};

// Log the configured URLs for easier debugging during development
if (import.meta.env.DEV) { // Only log in development mode for Vite
    console.log('[apiConfig] API_ENDPOINTS.API_ROOT set to:', API_ENDPOINTS.API_ROOT);
    console.log('[apiConfig] API_ENDPOINTS.BACKEND_ROOT_URL (for server pings/root access) set to:', API_ENDPOINTS.BACKEND_ROOT_URL);
    // console.log('[apiConfig] derivedBackendServerRoot (internal calculation) was:', derivedBackendServerRoot); // Optional: if you want to see the intermediate
}

export default API_ENDPOINTS;