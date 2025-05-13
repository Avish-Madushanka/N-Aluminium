// src/api/apiConfig.js
const moduleApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// ... (derivedBackendServerRoot logic as before) ...
let derivedBackendServerRoot;
if (moduleApiBaseUrl.endsWith('/api')) {
    derivedBackendServerRoot = moduleApiBaseUrl.substring(0, moduleApiBaseUrl.length - '/api'.length);
} else {
    derivedBackendServerRoot = moduleApiBaseUrl;
}

const API_ENDPOINTS = {
  API_ROOT: moduleApiBaseUrl,
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
    LOGIN: `${moduleApiBaseUrl}/auth/login`, // Used by all roles for login
  },
  BOOKINGS: {
    CREATE: `${moduleApiBaseUrl}/bookings`,
    GET_ALL: `${moduleApiBaseUrl}/bookings`,
    UPDATE_STATUS: `${moduleApiBaseUrl}/bookings`,
    UPDATE_ONE: `${moduleApiBaseUrl}/bookings`,
    DELETE_ONE: `${moduleApiBaseUrl}/bookings`,
  },
  SCRAP_TYPES: {
      GET_ALL: `${moduleApiBaseUrl}/scrap-types`,
      CREATE: `${moduleApiBaseUrl}/scrap-types`,
      UPDATE_ONE: `${moduleApiBaseUrl}/scrap-types`,
      DELETE_ONE: `${moduleApiBaseUrl}/scrap-types`,
  },
  // --- ADD COLLECTORS ENDPOINT ---
  COLLECTORS: {
    REGISTER: `${moduleApiBaseUrl}/collectors/register`, // For CollectorForm.jsx
    // GET_PROFILE: `${moduleApiBaseUrl}/collectors/profile/me`, // Example for future
    // UPDATE_PROFILE: `${moduleApiBaseUrl}/collectors/profile/me`, // Example for future
  },
  // --- END OF ADDITION ---
  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', '')
};

if (import.meta.env.DEV) {
    console.log('[apiConfig] API_ENDPOINTS.API_ROOT set to:', API_ENDPOINTS.API_ROOT);
    console.log('[apiConfig] API_ENDPOINTS.BACKEND_ROOT_URL set to:', API_ENDPOINTS.BACKEND_ROOT_URL);
    console.log('[apiConfig] API_ENDPOINTS.SCRAP_TYPES defined as:', API_ENDPOINTS.SCRAP_TYPES);
    console.log('[apiConfig] API_ENDPOINTS.COLLECTORS defined as:', API_ENDPOINTS.COLLECTORS); // Log new section
}

export default API_ENDPOINTS;