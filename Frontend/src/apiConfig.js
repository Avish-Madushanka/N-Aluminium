const API_BASE_URL = 'http://localhost:5003';

const API_ENDPOINTS = {
  API_ROOT: `${API_BASE_URL}/api`,
  
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    VERIFY_RESET_TOKEN: `${API_BASE_URL}/api/auth/verify-reset-token`
  },

  CLIENT: {
    REGISTER: `${API_BASE_URL}/api/clients/register`,
    PROFILE: (id) => `${API_BASE_URL}/api/clients/${id}`,
    MY_PROFILE: `${API_BASE_URL}/api/clients/profile/me`,
    UPDATE: (id) => `${API_BASE_URL}/api/clients/${id}`,
    UPDATE_MY_PROFILE: `${API_BASE_URL}/api/clients/profile/me/update`,
    DELETE: (id) => `${API_BASE_URL}/api/clients/${id}`
  },

  BOWNERS: {
    REGISTER: `${API_BASE_URL}/api/b-owners/register`,
    GET_ALL: `${API_BASE_URL}/api/b-owners`,
    PROFILE: (id) => `${API_BASE_URL}/api/b-owners/${id}`,
    MY_PROFILE: `${API_BASE_URL}/api/b-owners/me`,
    UPDATE_MY_PROFILE: `${API_BASE_URL}/api/b-owners/me`,
    DELETE: (id) => `${API_BASE_URL}/api/b-owners/${id}`,
  },

  PROJECTS: {
    CREATE: `${API_BASE_URL}/api/projects`,
    GET_ALL: `${API_BASE_URL}/api/projects`,
    GET_ONE: (id) => `${API_BASE_URL}/api/projects/${id}`,
    UPDATE_ONE: (id) => `${API_BASE_URL}/api/projects/${id}`,
    DELETE_ONE: (id) => `${API_BASE_URL}/api/projects/${id}`,
    GET_BY_CATEGORY: `${API_BASE_URL}/api/projects/category`,
    GET_FEATURED: `${API_BASE_URL}/api/projects/featured`,
    GET_STATS: `${API_BASE_URL}/api/projects/stats`
  },

  BOOKINGS: {
    CREATE: `${API_BASE_URL}/api/bookings`,
    GET_ALL: `${API_BASE_URL}/api/bookings`,
    GET_MY_BOOKINGS: `${API_BASE_URL}/api/bookings/my-bookings`,
    GET_ONE: (id) => `${API_BASE_URL}/api/bookings/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/bookings/${id}/status`,
    UPDATE_ONE: (id) => `${API_BASE_URL}/api/bookings/${id}`,
    DELETE_ONE: (id) => `${API_BASE_URL}/api/bookings/${id}`,
  },

  CALENDAR_SETTINGS: {
    GET: `${API_BASE_URL}/api/calendar-settings`,
    UPDATE: `${API_BASE_URL}/api/calendar-settings`,
  },

  SCRAP_TYPES: {
    GET_ALL: `${API_BASE_URL}/api/scrap-types`,
    CREATE: `${API_BASE_URL}/api/scrap-types`,
    UPDATE_ONE: (id) => `${API_BASE_URL}/api/scrap-types/${id}`,
    DELETE_ONE: (id) => `${API_BASE_URL}/api/scrap-types/${id}`,
    FORCE_DELETE_ONE: (id) => `${API_BASE_URL}/api/scrap-types/${id}/force`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/scrap-types/${id}`,
  },

  REVIEWS: {
    CREATE: `${API_BASE_URL}/api/reviews`,
    GET_ALL: `${API_BASE_URL}/api/reviews`,
    UPDATE: (id) => `${API_BASE_URL}/api/reviews/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/reviews/${id}`
  },

  ADMIN: {
    STATS_USER_DISTRIBUTION: `${API_BASE_URL}/api/admin/stats/user-distribution`,
    STATS_BOOKING_SUMMARY: `${API_BASE_URL}/api/admin/stats/booking-summary`,
    STATS_SALES_OVERVIEW: `${API_BASE_URL}/api/admin/stats/sales-overview`,
  },

  SALE_ITEMS: {
    CREATE: `${API_BASE_URL}/api/saleitems`,
    GET_ALL: `${API_BASE_URL}/api/saleitems`,
    GET_ONE: (id) => `${API_BASE_URL}/api/saleitems/${id}`,
    UPDATE_ONE: (id) => `${API_BASE_URL}/api/saleitems/${id}`,
    DELETE_ONE: (id) => `${API_BASE_URL}/api/saleitems/${id}`,
  },

  ITEMS: {
    GET_ALL: `${API_BASE_URL}/api/items`,
    GET_FEATURED: `${API_BASE_URL}/api/items/featured`,
    GET_ONE: (id) => `${API_BASE_URL}/api/items/${id}`,
    CREATE: `${API_BASE_URL}/api/items`,
    UPDATE: (id) => `${API_BASE_URL}/api/items/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/items/${id}`,
    GET_BY_CATEGORY: (category) => `${API_BASE_URL}/api/items/category/${category}`,
  },

  CART: {
    GET: `${API_BASE_URL}/api/cart`,
    ADD: `${API_BASE_URL}/api/cart/add`,
    UPDATE: (id) => `${API_BASE_URL}/api/cart/${id}`,
    REMOVE: (id) => `${API_BASE_URL}/api/cart/${id}`,
    CLEAR: `${API_BASE_URL}/api/cart`,
    REMOVE_MULTIPLE: `${API_BASE_URL}/api/cart/remove-multiple`
  },

  QUOTATIONS: {
    GET_ALL: `${API_BASE_URL}/api/quotations`,
    CREATE: `${API_BASE_URL}/api/quotations`,
    GET_MY: `${API_BASE_URL}/api/quotations/my-requests`,
    GET_ONE: (id) => `${API_BASE_URL}/api/quotations/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/quotations/${id}/status`,
    DELETE: (id) => `${API_BASE_URL}/api/quotations/${id}`,
    GET_STATS: `${API_BASE_URL}/api/quotations/stats`
  },

  ALUMNI: {
    REGISTER: `${API_BASE_URL}/api/alumni/register`,
    GET_ALL: `${API_BASE_URL}/api/alumni`,
    GET_STATS: `${API_BASE_URL}/api/alumni/stats`,
    GET_ONE: (id) => `${API_BASE_URL}/api/alumni/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/alumni/${id}/status`,
    DELETE: (id) => `${API_BASE_URL}/api/alumni/${id}`,
  },

  BUY_AND_SELL: {
    GET_ALL: `${API_BASE_URL}/api/buy-and-sell`,
    GET_MY: `${API_BASE_URL}/api/buy-and-sell/my-items`,
    GET_ONE: (id) => `${API_BASE_URL}/api/buy-and-sell/${id}`,
    CREATE: `${API_BASE_URL}/api/buy-and-sell`,
    UPDATE: (id) => `${API_BASE_URL}/api/buy-and-sell/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/buy-and-sell/${id}/status`,
    DELETE: (id) => `${API_BASE_URL}/api/buy-and-sell/${id}`,
  },

  GLASS: {
    PRODUCTS: `${API_BASE_URL}/api/glass/products`,
    UPDATE_PRODUCTS: `${API_BASE_URL}/api/glass/products`,
    RESET_PRODUCTS: `${API_BASE_URL}/api/glass/products/reset`,
    ORDERS: `${API_BASE_URL}/api/glass/orders`,
    ORDER_STATS: `${API_BASE_URL}/api/glass/orders/stats`,
    ORDER_BY_ID: (id) => `${API_BASE_URL}/api/glass/orders/${id}`,
    USER_ORDERS: (email) => `${API_BASE_URL}/api/glass/orders/user/${email}`,
    UPDATE_ORDER_STATUS: (id) => `${API_BASE_URL}/api/glass/orders/${id}/status`,
    PAYPAL_CREATE: `${API_BASE_URL}/api/glass/paypal/create-order`,
    PAYPAL_CAPTURE: `${API_BASE_URL}/api/glass/paypal/capture-order`,
  },

  ALU_QUOTATIONS: {
    CREATE: `${API_BASE_URL}/api/alu-quotations`,
    GET_MY: `${API_BASE_URL}/api/alu-quotations/my-requests`,
    GET_ALL: `${API_BASE_URL}/api/alu-quotations`,
    GET_STATS: `${API_BASE_URL}/api/alu-quotations/stats`,
    GET_ONE: (id) => `${API_BASE_URL}/api/alu-quotations/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/alu-quotations/${id}/status`,
    DELETE: (id) => `${API_BASE_URL}/api/alu-quotations/${id}`,
  },

  CONTACT: {
    SUBMIT: `${API_BASE_URL}/api/contact/submit`,
    GET_ALL: `${API_BASE_URL}/api/contact`,
    GET_STATS: `${API_BASE_URL}/api/contact/stats`,
    GET_ONE: (id) => `${API_BASE_URL}/api/contact/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/contact/${id}/status`,
    SEND_REPLY: (id) => `${API_BASE_URL}/api/contact/${id}/reply`,
    DELETE: (id) => `${API_BASE_URL}/api/contact/${id}`,
  },

  SHOP_LOCATIONS: {
    GET_ALL: `${API_BASE_URL}/api/shop-locations`,
    CREATE: `${API_BASE_URL}/api/shop-locations`,
    GET_ONE: (id) => `${API_BASE_URL}/api/shop-locations/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/shop-locations/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/shop-locations/${id}`,
  },

  HEALTH_CHECK: `${API_BASE_URL}/api/health`,
};

export default API_ENDPOINTS;