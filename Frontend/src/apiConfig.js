
const API_ENDPOINTS = {
  API_ROOT: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api',
  
  AUTH: {
    LOGIN: '/auth/login', // These are relative to the baseURL in axiosInstance
    LOGOUT: '/auth/logout', // Assuming these exist on backend
    REFRESH: '/auth/refresh', // Assuming these exist on backend
    FORGOT_PASSWORD: '/auth/forgot-password', // Assuming these exist on backend
    RESET_PASSWORD: '/auth/reset-password' // Assuming these exist on backend
  },

  CLIENT: {
    REGISTER: '/clients/register',
    PROFILE: (id) => `/clients/${id}`, 
    MY_PROFILE: '/clients/profile/me', // If you have a dedicated route for this
    UPDATE: (id) => `/clients/${id}`, 
    UPDATE_MY_PROFILE: '/clients/profile/me/update', // If you have a dedicated route
    DELETE: (id) => `/clients/${id}`  
  },

  BOWNERS: {
    REGISTER: '/b-owners/register',
    GET_ALL: '/b-owners', 
    PROFILE: (id) => `/b-owners/${id}`, 
    MY_PROFILE: '/b-owners/me', 
    UPDATE_MY_PROFILE: '/b-owners/me', 
    DELETE: (id) => `/b-owners/${id}`, 
    // VERIFY: (id) => `/b-owners/${id}/verify` // If this route exists
  },

  PROJECTS: { // Add this section
    CREATE: '/projects', // POST to /api/projects
    GET_ALL: '/projects', // GET /api/projects
    GET_ONE: (id) => `/projects/${id}`, // GET /api/projects/:id
    UPDATE_ONE: (id) => `/projects/${id}`, // PUT /api/projects/:id
    DELETE_ONE: (id) => `/projects/${id}`, // DELETE /api/projects/:id
  },

  // COLLECTORS section seems like placeholders, ensure backend routes exist if used

  BOOKINGS: {
    CREATE: '/bookings',
    GET_ALL: '/bookings', // Admin: get all bookings. Can also take query params.
    GET_MY_BOOKINGS: '/bookings/my-bookings', // Corrected based on typical route structure
    GET_ONE: (id) => `/bookings/${id}`,
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    UPDATE_ONE: (id) => `/bookings/${id}`,    // Admin: full update
    DELETE_ONE: (id) => `/bookings/${id}`,  // Admin: delete
    // For dashboard recent bookings - GET_ALL can be used with query parameters
    // No need for a separate GET_RECENT_WITH_PARAMS if GET_ALL handles query strings.
    // We will construct the query string in the Dashboard.jsx call.
  },

  CALENDAR_SETTINGS: {
    GET: '/calendar-settings',
    UPDATE: '/calendar-settings',
    // AVAILABILITY: '/calendar-settings/availability' // Ensure this exists if used
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
    // STATS endpoints, relative to axiosInstance.defaults.baseURL
    STATS_USER_DISTRIBUTION: '/admin/stats/user-distribution',
    STATS_BOOKING_SUMMARY: '/admin/stats/booking-summary',
    STATS_SALES_OVERVIEW: '/admin/stats/sales-overview',

    // Other potential admin endpoints
    // USERS: '/admin/users', 
    // USER_BY_ID: (userId) => `/admin/users/${userId}`, 
  },

  SALE_ITEMS: {
    CREATE: '/saleitems',
    GET_ALL: '/saleitems', // Can take query params for filtering/sorting
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