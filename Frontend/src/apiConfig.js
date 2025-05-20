// frontend/src/api/apiConfig.js

const API_ENDPOINTS = {
  // API_ROOT: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api', // Keep for reference or non-Axios use if needed
  
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },

  CLIENT: {
    REGISTER: '/clients/register',
    PROFILE: (id) => `/clients/${id}`, // For fetching profile by ID
    MY_PROFILE: '/clients/profile/me', // Or a specific route for the logged-in user's profile
    UPDATE: (id) => `/clients/${id}`, // For updating profile by ID
    UPDATE_MY_PROFILE: '/clients/profile/me/update', // Or a specific route
    DELETE: (id) => `/clients/${id}`  // For deleting profile by ID
  },

  BOWNERS: {
    REGISTER: '/b-owners/register',
    GET_ALL: '/b-owners', // Corrected to be a relative path
    PROFILE: (id) => `/b-owners/${id}`, // For fetching profile by ID
    MY_PROFILE: '/b-owners/profile/me', // Or a specific route
    UPDATE: (id) => `/b-owners/${id}`, // For updating profile by ID
    UPDATE_MY_PROFILE: '/b-owners/profile/me/update', // Or specific route
    DELETE: (id) => `/b-owners/${id}`, // For deleting profile by ID
    VERIFY: (id) => `/b-owners/${id}/verify` // For verifying a business owner
  },

  COLLECTORS: {
    REGISTER: '/collectors/register',
    GET_ALL: '/collectors',
    PROFILE: (id) => `/collectors/${id}`,
    UPDATE: (id) => `/collectors/${id}`,
    DELETE: (id) => `/collectors/${id}`,
    ASSIGN_BOOKING: '/collectors/assign-booking' // This might need collectorId and bookingId
  },

  BOOKINGS: {
    CREATE: '/bookings',
    GET_ALL: '/bookings', // Admin route
    GET_ONE: (id) => `/bookings/${id}`,
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    UPDATE_ONE: (id) => `/bookings/${id}`,
    DELETE_ONE: (id) => `/bookings/${id}`,
    CLIENT_BOOKINGS: '/bookings/user/client', // Assuming a route for logged-in client's bookings
    OWNER_BOOKINGS: '/bookings/user/b-owner' // Assuming a route for logged-in b-owner's bookings
  },

  CALENDAR_SETTINGS: {
    GET: '/calendar-settings',
    UPDATE: '/calendar-settings',
    AVAILABILITY: '/calendar-settings/availability' // Might be GET or POST depending on use
  },

  SCRAP_TYPES: {
    GET_ALL: '/scrap-types',
    CREATE: '/scrap-types',
    UPDATE_ONE: (id) => `/scrap-types/${id}`,
    DELETE_ONE: (id) => `/scrap-types/${id}`, // Soft delete
    FORCE_DELETE_ONE: (id) => `/scrap-types/${id}/force`, // Permanent delete
    GET_BY_ID: (id) => `/scrap-types/${id}`,
    GET_BY_OWNER: (ownerId) => `/scrap-types/owner/${ownerId}` // If specific to an owner
  },

  REVIEWS: {
    CREATE: '/reviews',
    GET_ALL: '/reviews', // Can be public (approved) or admin (all)
    GET_BY_OWNER: (ownerId) => `/reviews/owner/${ownerId}`,
    GET_BY_CLIENT: (clientId) => `/reviews/client/${clientId}`,
    UPDATE: (id) => `/reviews/${id}`, // For admin to approve/edit
    DELETE: (id) => `/reviews/${id}`  // For admin
  },

  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users', // For managing all users
    USER_BY_ID: (userId) => `/admin/users/${userId}`, // For a specific user
    BOOKINGS: '/admin/bookings' // Likely same as BOOKINGS.GET_ALL but for admin context
  },

  // This provides the server root, e.g., "http://localhost:5003"
  // Useful for constructing full URLs for static assets like images.
  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', ''),
  
  // This is a relative path for an API call to a health check endpoint
  HEALTH_CHECK: '/health', // Matched with /api/health in server.js
  
  // For accessing static uploaded files, use BACKEND_ROOT_URL + stored_file_path (e.g., /uploads/image.png)
};

if (import.meta.env.DEV) {
  console.log('[apiConfig] API_ENDPOINTS (using relative paths for Axios) fully initialized.');
}

export default API_ENDPOINTS;