const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

const API_ENDPOINTS = {
  API_ROOT: API_BASE_URL,
  
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`
  },

  CLIENT: {
    REGISTER: `${API_BASE_URL}/clients/register`,
    PROFILE: (id) => `${API_BASE_URL}/clients/${id}`,
    MY_PROFILE: `${API_BASE_URL}/clients/profile/me`,
    UPDATE: (id) => `${API_BASE_URL}/clients/${id}`,
    UPDATE_MY_PROFILE: `${API_BASE_URL}/clients/profile/me/update`,
    DELETE: (id) => `${API_BASE_URL}/clients/${id}`
  },

  BOWNERS: {
    REGISTER: `${API_BASE_URL}/b-owners/register`,
    GET_ALL: `${API_BASE_URL}/b-owners`,
    PROFILE: (id) => `${API_BASE_URL}/b-owners/${id}`,
    MY_PROFILE: `${API_BASE_URL}/b-owners/me`,
    UPDATE_MY_PROFILE: `${API_BASE_URL}/b-owners/me`,
    DELETE: (id) => `${API_BASE_URL}/b-owners/${id}`,
  },

  PROJECTS: {
    CREATE: `${API_BASE_URL}/projects`,
    GET_ALL: `${API_BASE_URL}/projects`,
    GET_ONE: (id) => `${API_BASE_URL}/projects/${id}`,
    UPDATE_ONE: (id) => `${API_BASE_URL}/projects/${id}`,
    DELETE_ONE: (id) => `${API_BASE_URL}/projects/${id}`,
    GET_BY_CATEGORY: `${API_BASE_URL}/projects/category`,
    GET_FEATURED: `${API_BASE_URL}/projects/featured`,
    GET_STATS: `${API_BASE_URL}/projects/stats`
  },

  BOOKINGS: {
    CREATE: `${API_BASE_URL}/bookings`,
    GET_ALL: `${API_BASE_URL}/bookings`,
    GET_MY_BOOKINGS: `${API_BASE_URL}/bookings/my-bookings`,
    GET_ONE: (id) => `${API_BASE_URL}/bookings/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/bookings/${id}/status`,
    UPDATE_ONE: (id) => `${API_BASE_URL}/bookings/${id}`,
    DELETE_ONE: (id) => `${API_BASE_URL}/bookings/${id}`,
  },

  CALENDAR_SETTINGS: {
    GET: `${API_BASE_URL}/calendar-settings`,
    UPDATE: `${API_BASE_URL}/calendar-settings`,
  },

  SCRAP_TYPES: {
    GET_ALL: `${API_BASE_URL}/scrap-types`,
    CREATE: `${API_BASE_URL}/scrap-types`,
    UPDATE_ONE: (id) => `${API_BASE_URL}/scrap-types/${id}`,
    DELETE_ONE: (id) => `${API_BASE_URL}/scrap-types/${id}`,
    FORCE_DELETE_ONE: (id) => `${API_BASE_URL}/scrap-types/${id}/force`,
    GET_BY_ID: (id) => `${API_BASE_URL}/scrap-types/${id}`,
  },

  REVIEWS: {
    CREATE: `${API_BASE_URL}/reviews`,
    GET_ALL: `${API_BASE_URL}/reviews`,
    UPDATE: (id) => `${API_BASE_URL}/reviews/${id}`,
    DELETE: (id) => `${API_BASE_URL}/reviews/${id}`
  },

  ADMIN: {
    STATS_USER_DISTRIBUTION: `${API_BASE_URL}/admin/stats/user-distribution`,
    STATS_BOOKING_SUMMARY: `${API_BASE_URL}/admin/stats/booking-summary`,
    STATS_SALES_OVERVIEW: `${API_BASE_URL}/admin/stats/sales-overview`,
  },

  SALE_ITEMS: {
    CREATE: `${API_BASE_URL}/saleitems`,
    GET_ALL: `${API_BASE_URL}/saleitems`,
    GET_ONE: (id) => `${API_BASE_URL}/saleitems/${id}`,
    UPDATE_ONE: (id) => `${API_BASE_URL}/saleitems/${id}`,
    DELETE_ONE: (id) => `${API_BASE_URL}/saleitems/${id}`,
  },

  ITEMS: {
    GET_ALL: `${API_BASE_URL}/items`,
    GET_FEATURED: `${API_BASE_URL}/items/featured`,
    GET_ONE: (id) => `${API_BASE_URL}/items/${id}`,
    CREATE: `${API_BASE_URL}/items`,
    UPDATE: (id) => `${API_BASE_URL}/items/${id}`,
    DELETE: (id) => `${API_BASE_URL}/items/${id}`,
    GET_BY_CATEGORY: (category) => `${API_BASE_URL}/items/category/${category}`,
  },

  CART: {
    GET: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/add`,
    UPDATE: (id) => `${API_BASE_URL}/cart/${id}`,
    REMOVE: (id) => `${API_BASE_URL}/cart/${id}`,
    CLEAR: `${API_BASE_URL}/cart`,
    REMOVE_MULTIPLE: `${API_BASE_URL}/cart/remove-multiple`
  },

  QUOTATIONS: {
    GET_ALL: `${API_BASE_URL}/quotations`,
    CREATE: `${API_BASE_URL}/quotations`,
    GET_MY: `${API_BASE_URL}/quotations/my-requests`,
    GET_ONE: (id) => `${API_BASE_URL}/quotations/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/quotations/${id}/status`,
    DELETE: (id) => `${API_BASE_URL}/quotations/${id}`,
    GET_STATS: `${API_BASE_URL}/quotations/stats`
  },

  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', ''),
  
  HEALTH_CHECK: `${API_BASE_URL}/health`,
};

export default API_ENDPOINTS;