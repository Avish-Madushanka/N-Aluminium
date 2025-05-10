// apiConfig.js
const moduleApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

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

export default API_ENDPOINTS;