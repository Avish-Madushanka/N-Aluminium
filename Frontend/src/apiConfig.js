// apiConfig.js
const moduleApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// Determine the absolute root of the backend server.
let derivedBackendServerRoot;

if (moduleApiBaseUrl.endsWith('/api')) {
    derivedBackendServerRoot = moduleApiBaseUrl.substring(0, moduleApiBaseUrl.length - '/api'.length);
} else {
    derivedBackendServerRoot = moduleApiBaseUrl;
    console.warn(
        `[apiConfig] moduleApiBaseUrl ("${moduleApiBaseUrl}") does not end with "/api". ` +
        `derivedBackendServerRoot will be the same as moduleApiBaseUrl. ` +
        `Ensure this is intended for root pings.`
    );
}

const API_ENDPOINTS = { // <--- Make sure this is the object being exported
  API_ROOT: moduleApiBaseUrl,
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
    GET_ALL: `${moduleApiBaseUrl}/bookings`,
    UPDATE_STATUS: `${moduleApiBaseUrl}/bookings`,
    UPDATE_ONE: `${moduleApiBaseUrl}/bookings`,
    DELETE_ONE: `${moduleApiBaseUrl}/bookings`,
  },

  // ===========================================================
  // === ENSURE THIS SECTION EXISTS AND IS CORRECTLY TYPED ===
  // ===========================================================
  SCRAP_TYPES: {  // <--- THIS KEY MUST BE EXACTLY "SCRAP_TYPES"
      GET_ALL: `${moduleApiBaseUrl}/scrap-types`,    // <--- Must have GET_ALL
      CREATE: `${moduleApiBaseUrl}/scrap-types`,     // <--- Must have CREATE
      UPDATE_ONE: `${moduleApiBaseUrl}/scrap-types`, // <--- Must have UPDATE_ONE
      DELETE_ONE: `${moduleApiBaseUrl}/scrap-types`, // <--- Must have DELETE_ONE
  },
  // ===========================================================

  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', '')
};

// This log should now show the SCRAP_TYPES object if defined correctly above
if (import.meta.env.DEV) {
    console.log('[apiConfig] Initializing API_ENDPOINTS:', API_ENDPOINTS); // Log the whole object
    console.log('[apiConfig] API_ENDPOINTS.SCRAP_TYPES defined as:', API_ENDPOINTS.SCRAP_TYPES);
}

export default API_ENDPOINTS; // <--- Make sure this line exports the API_ENDPOINTS object