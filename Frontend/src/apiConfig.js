const moduleApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

const API_ENDPOINTS = {
  API_ROOT: moduleApiBaseUrl,
  
  AUTH: {
    LOGIN: `${moduleApiBaseUrl}/auth/login`,
    LOGOUT: `${moduleApiBaseUrl}/auth/logout`,
    REFRESH: `${moduleApiBaseUrl}/auth/refresh`,
    FORGOT_PASSWORD: `${moduleApiBaseUrl}/auth/forgot-password`,
    RESET_PASSWORD: `${moduleApiBaseUrl}/auth/reset-password`
  },

  CLIENT: {
    REGISTER: `${moduleApiBaseUrl}/clients/register`,
    PROFILE: `${moduleApiBaseUrl}/clients/profile`,
    UPDATE: `${moduleApiBaseUrl}/clients/update`,
    DELETE: `${moduleApiBaseUrl}/clients/delete`
  },

  BOWNERS: {
    REGISTER: `${moduleApiBaseUrl}/b-owners/register`,
    GET_ALL: `${moduleApiBaseUrl}/b-owners`,
    PROFILE: `${moduleApiBaseUrl}/b-owners/profile`,
    UPDATE: `${moduleApiBaseUrl}/b-owners/update`,
    DELETE: `${moduleApiBaseUrl}/b-owners/delete`,
    VERIFY: `${moduleApiBaseUrl}/b-owners/verify`
  },

  COLLECTORS: {
    REGISTER: `${moduleApiBaseUrl}/collectors/register`,
    GET_ALL: `${moduleApiBaseUrl}/collectors`,
    PROFILE: `${moduleApiBaseUrl}/collectors/profile`,
    UPDATE: `${moduleApiBaseUrl}/collectors/update`,
    DELETE: `${moduleApiBaseUrl}/collectors/delete`,
    ASSIGN_BOOKING: `${moduleApiBaseUrl}/collectors/assign-booking`
  },

  BOOKINGS: {
    CREATE: `${moduleApiBaseUrl}/bookings`,
    GET_ALL: `${moduleApiBaseUrl}/bookings`,
    GET_ONE: `${moduleApiBaseUrl}/bookings`,
    UPDATE_STATUS: `${moduleApiBaseUrl}/bookings/status`,
    UPDATE_ONE: `${moduleApiBaseUrl}/bookings`,
    DELETE_ONE: `${moduleApiBaseUrl}/bookings`,
    CLIENT_BOOKINGS: `${moduleApiBaseUrl}/bookings/client`,
    OWNER_BOOKINGS: `${moduleApiBaseUrl}/bookings/owner`
  },

  CALENDAR_SETTINGS: {
    GET: `${moduleApiBaseUrl}/calendar-settings`,
    UPDATE: `${moduleApiBaseUrl}/calendar-settings`,
    AVAILABILITY: `${moduleApiBaseUrl}/calendar-settings/availability`
  },

  SCRAP_TYPES: {
    GET_ALL: `${moduleApiBaseUrl}/scrap-types`,
    CREATE: `${moduleApiBaseUrl}/scrap-types`,
    UPDATE_ONE: `${moduleApiBaseUrl}/scrap-types`,
    DELETE_ONE: `${moduleApiBaseUrl}/scrap-types`,
    GET_BY_OWNER: `${moduleApiBaseUrl}/scrap-types/owner`
  },

  REVIEWS: {
    CREATE: `${moduleApiBaseUrl}/reviews`,
    GET_ALL: `${moduleApiBaseUrl}/reviews`,
    GET_BY_OWNER: `${moduleApiBaseUrl}/reviews/owner`,
    GET_BY_CLIENT: `${moduleApiBaseUrl}/reviews/client`,
    UPDATE: `${moduleApiBaseUrl}/reviews`,
    DELETE: `${moduleApiBaseUrl}/reviews`
  },

  ADMIN: {
    STATS: `${moduleApiBaseUrl}/admin/stats`,
    USERS: `${moduleApiBaseUrl}/admin/users`,
    BOOKINGS: `${moduleApiBaseUrl}/admin/bookings`
  },

  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', ''),
  HEALTH_CHECK: `${moduleApiBaseUrl}/healthcheck`,
  UPLOADS: `${moduleApiBaseUrl}/uploads`
};

if (import.meta.env.DEV) {
  console.log('[apiConfig] API_ENDPOINTS fully initialized:', JSON.parse(JSON.stringify(API_ENDPOINTS)));
}

export default API_ENDPOINTS;