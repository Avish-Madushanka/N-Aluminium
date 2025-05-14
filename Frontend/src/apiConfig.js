// Frontend/src/api/apiConfig.js
// ... (other endpoints as before) ...
const moduleApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

const API_ENDPOINTS = {
  // ... (API_ROOT, CLIENT, BOWNERS, CALENDAR_SETTINGS, AUTH, BOOKINGS, SCRAP_TYPES as before) ...
  API_ROOT: moduleApiBaseUrl,
  CLIENT: { REGISTER: `${moduleApiBaseUrl}/clients/register` },
  BOWNERS: { REGISTER: `${moduleApiBaseUrl}/b-owners/register` },
  CALENDAR_SETTINGS: { GET: `${moduleApiBaseUrl}/calendar-settings`, UPDATE: `${moduleApiBaseUrl}/calendar-settings` },
  AUTH: { LOGIN: `${moduleApiBaseUrl}/auth/login` },
  BOOKINGS: { CREATE: `${moduleApiBaseUrl}/bookings`, GET_ALL: `${moduleApiBaseUrl}/bookings`, UPDATE_STATUS: `${moduleApiBaseUrl}/bookings`, UPDATE_ONE: `${moduleApiBaseUrl}/bookings`, DELETE_ONE: `${moduleApiBaseUrl}/bookings`},
  SCRAP_TYPES: { GET_ALL: `${moduleApiBaseUrl}/scrap-types`, CREATE: `${moduleApiBaseUrl}/scrap-types`, UPDATE_ONE: `${moduleApiBaseUrl}/scrap-types`, DELETE_ONE: `${moduleApiBaseUrl}/scrap-types`},
  REVIEWS: { CREATE: `${moduleApiBaseUrl}/reviews`, GET_ALL: `${moduleApiBaseUrl}/reviews`},

  COLLECTORS: { // <-- Add this section
    REGISTER: `${moduleApiBaseUrl}/collectors/register`,
    // Add other collector-specific frontend endpoint names if needed
  },

  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', '')
};

if (import.meta.env.DEV) {
    console.log('[apiConfig] API_ENDPOINTS fully initialized:', JSON.parse(JSON.stringify(API_ENDPOINTS)));
}

export default API_ENDPOINTS;