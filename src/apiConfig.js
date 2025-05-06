// src/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003';

const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL, // Needed for axiosInstance and status checks
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    // ME: `${API_BASE_URL}/api/auth/me`, // If you have a "get current user" endpoint
  },
  CLIENT: {
    REGISTER: `${API_BASE_URL}/api/clients/register`,
    // Define your client profile update endpoint if different from GET /me
    UPDATE_PROFILE: (clientId) => `${API_BASE_URL}/api/clients/${clientId}`, // Example structure
  },
  ADMIN: {
    SETTINGS: `${API_BASE_URL}/api/admin/settings`,
  }
  // ... other endpoints
};

export default API_ENDPOINTS;