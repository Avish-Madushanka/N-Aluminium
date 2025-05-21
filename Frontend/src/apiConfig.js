// frontend/src/api/apiConfig.js

const API_ENDPOINTS = {
  API_ROOT: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api',
  
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },

  CLIENT: {
    REGISTER: '/clients/register',
    PROFILE: (id) => `/clients/${id}`, 
    MY_PROFILE: '/clients/profile/me', 
    UPDATE: (id) => `/clients/${id}`, 
    UPDATE_MY_PROFILE: '/clients/profile/me/update', 
    DELETE: (id) => `/clients/${id}`  
  },

  BOWNERS: {
    REGISTER: '/b-owners/register',
    GET_ALL: '/b-owners', 
    PROFILE: (id) => `/b-owners/${id}`, 
    MY_PROFILE: '/b-owners/me', // Matched to bOwnerRoutes.js which uses /me for get and put
    UPDATE: (id) => `/b-owners/${id}`, 
    UPDATE_MY_PROFILE: '/b-owners/me', // Matched to bOwnerRoutes.js
    DELETE: (id) => `/b-owners/${id}`, 
    VERIFY: (id) => `/b-owners/${id}/verify` 
  },

  COLLECTORS: {
    // These seem to be placeholders, ensure they exist in backend if used
    REGISTER: '/collectors/register',
    GET_ALL: '/collectors',
    PROFILE: (id) => `/collectors/${id}`,
    UPDATE: (id) => `/collectors/${id}`,
    DELETE: (id) => `/collectors/${id}`,
    ASSIGN_BOOKING: '/collectors/assign-booking' 
  },

  BOOKINGS: {
    CREATE: '/bookings',
    GET_ALL: '/bookings',                  // Admin: get all bookings
    GET_MY_BOOKINGS: '/bookings/my-bookings', // For logged-in user
    GET_ONE: (id) => `/bookings/${id}`,
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    UPDATE_ONE: (id) => `/bookings/${id}`,    // Admin: full update
    DELETE_ONE: (id) => `/bookings/${id}`,  // Admin: delete
    // CLIENT_BOOKINGS and OWNER_BOOKINGS might be redundant if GET_MY_BOOKINGS serves general user type
  },

  CALENDAR_SETTINGS: {
    GET: '/calendar-settings',
    UPDATE: '/calendar-settings',
    AVAILABILITY: '/calendar-settings/availability' // Ensure this exists if used
  },

  SCRAP_TYPES: {
    GET_ALL: '/scrap-types',
    CREATE: '/scrap-types',
    UPDATE_ONE: (id) => `/scrap-types/${id}`,
    DELETE_ONE: (id) => `/scrap-types/${id}`, 
    FORCE_DELETE_ONE: (id) => `/scrap-types/${id}/force`, 
    GET_BY_ID: (id) => `/scrap-types/${id}`,
    // GET_BY_OWNER might be an admin/specific feature, ensure it exists
  },

  REVIEWS: {
    CREATE: '/reviews',
    GET_ALL: '/reviews', 
    // GET_BY_OWNER & GET_BY_CLIENT might be specific admin/listing features
    UPDATE: (id) => `/reviews/${id}`, 
    DELETE: (id) => `/reviews/${id}`  
  },

  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users', 
    USER_BY_ID: (userId) => `/admin/users/${userId}`, 
    BOOKINGS: '/admin/bookings' // Potentially redundant with BOOKINGS.GET_ALL if admin uses that
  },

  SALE_ITEMS: {
    CREATE: '/saleitems',
    GET_ALL: '/saleitems',
    GET_ONE: (id) => `/saleitems/${id}`,
    UPDATE_ONE: (id) => `/saleitems/${id}`,
    DELETE_ONE: (id) => `/saleitems/${id}`,
  },

  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', ''),
  
  HEALTH_CHECK: '/health', 
  
};

if (import.meta.env.DEV) {
  console.log('[apiConfig] API_ENDPOINTS (using relative paths for Axios) fully initialized.');
}

export default API_ENDPOINTS;