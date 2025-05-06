// src/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003';

const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  CLIENT: {
    REGISTER: `${API_BASE_URL}/api/clients/register`,
  },
  // --- Ensure this part exists ---
  ADMIN: {
    SETTINGS: `${API_BASE_URL}/api/admin/settings`, // Make sure this matches your backend route
    // BOOKINGS: `${API_BASE_URL}/api/admin/bookings`, // Example other admin routes
  }
  // --- End Ensure ---
  // ... other endpoints
};

export default API_ENDPOINTS;