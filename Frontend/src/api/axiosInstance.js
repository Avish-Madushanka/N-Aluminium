// frontend/src/api/axiosInstance.js
import axios from 'axios';

// Ensure VITE_API_BASE_URL is in your frontend .env file
// Example: VITE_API_BASE_URL=http://localhost:5003/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';
const REQUEST_TIMEOUT = 15000; // 15 seconds
const AUTH_TOKEN_STORAGE_KEY = 'token'; // Or whatever key you use for your auth token

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // This ensures relative paths work correctly
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    
    // Construct full URL for logging (Axios handles this internally for the actual request)
    // let fullUrlForLog = config.url;
    // if (config.baseURL && !config.url.startsWith('http')) {
    //   fullUrlForLog = `${config.baseURL.replace(/\/$/, '')}/${config.url.replace(/^\//, '')}`;
    // }
    // console.log(`[Axios Req] Sending ${config.method?.toUpperCase()} to ${fullUrlForLog}`);

    if (token) {
      // Only add Authorization header if it's not already present
      // This allows for specific requests to override the default token if needed
      if (!config.headers['Authorization']) {
        // console.log(`[Axios Req] Attaching token to Authorization header for ${fullUrlForLog}`);
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        // console.log(`[Axios Req] Authorization header already present for ${fullUrlForLog}`);
      }
    } else {
      // console.log(`[Axios Req] No token found in localStorage for ${fullUrlForLog}`);
    }
    return config;
  },
  (error) => {
    console.error("[Axios Req Error]", error.config?.url, error.message, error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log(`[Axios Res] Received ${response.status} from ${response.config.baseURL}${response.config.url}`);
    return response; // Return the successful response
  },
  (error) => {
    const config = error.config || {};
    const requestUrl = config.baseURL ? `${config.baseURL.replace(/\/$/, '')}/${(config.url || '').replace(/^\//, '')}` : config.url || 'unknown URL';

    console.error(`[Axios Res Error] for ${requestUrl}`);

    if (error.response) {
      const { status, data } = error.response;
      console.warn(`[Axios Res Error] Server responded with Status: ${status} | Data:`, data);

      if (status === 401) {
        console.warn(`[Axios Res Error] 401 Unauthorized. Potential session expiry. URL: ${requestUrl}`);
        // Consider clearing token and redirecting to login
        // localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        // window.location.href = '/login'; // Or use React Router for navigation
        window.dispatchEvent(new CustomEvent('auth-error-401', {
          detail: { message: data?.message || 'Your session has expired or is invalid. Please log in again.' }
        }));
      } else if (status === 403) {
        console.warn(`[Axios Res Error] 403 Forbidden. You do not have permission. URL: ${requestUrl}`);
      } else if (status === 404) {
        console.warn(`[Axios Res Error] 404 Not Found. Endpoint may be incorrect. URL: ${requestUrl}`);
      } else if (status >= 500) {
        console.error(`[Axios Res Error] Server Error ${status}. URL: ${requestUrl}`, data);
      }
    } else if (error.request) {
      console.error(`[Axios Res Error] Network Error or No Response from server for URL: ${requestUrl}`, error.message);
      // This can happen due to CORS issues, backend down, or network connectivity problems
    } else {
      console.error(`[Axios Res Error] Error setting up request for URL: ${requestUrl}`, error.message);
    }
    return Promise.reject(error); // Important to reject the promise so .catch() in calling code works
  }
);

export default axiosInstance;