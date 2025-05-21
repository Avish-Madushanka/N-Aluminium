
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
    MY_PROFILE: '/b-owners/me', 
    UPDATE_MY_PROFILE: '/b-owners/me', 
    DELETE: (id) => `/b-owners/${id}`, 
  },

  PROJECTS: {
    CREATE: '/projects', 
    GET_ALL: '/projects', 
    GET_ONE: (id) => `/projects/${id}`, 
    UPDATE_ONE: (id) => `/projects/${id}`, 
    DELETE_ONE: (id) => `/projects/${id}`, 
  },

  BOOKINGS: {
    CREATE: '/bookings',
    GET_ALL: '/bookings',
    GET_MY_BOOKINGS: '/bookings/my-bookings', 
    GET_ONE: (id) => `/bookings/${id}`,
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    UPDATE_ONE: (id) => `/bookings/${id}`,  
    DELETE_ONE: (id) => `/bookings/${id}`, 
  },

  CALENDAR_SETTINGS: {
    GET: '/calendar-settings',
    UPDATE: '/calendar-settings',
  },

  SCRAP_TYPES: {
    GET_ALL: '/scrap-types',
    CREATE: '/scrap-types',
    UPDATE_ONE: (id) => `/scrap-types/${id}`,
    DELETE_ONE: (id) => `/scrap-types/${id}`, 
    FORCE_DELETE_ONE: (id) => `/scrap-types/${id}/force`, 
    GET_BY_ID: (id) => `/scrap-types/${id}`,
  },

  REVIEWS: {
    CREATE: '/reviews',
    GET_ALL: '/reviews', 
    UPDATE: (id) => `/reviews/${id}`, 
    DELETE: (id) => `/reviews/${id}`  
  },

  ADMIN: {
    STATS_USER_DISTRIBUTION: '/admin/stats/user-distribution',
    STATS_BOOKING_SUMMARY: '/admin/stats/booking-summary',
    STATS_SALES_OVERVIEW: '/admin/stats/sales-overview',

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