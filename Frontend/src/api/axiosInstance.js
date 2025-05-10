// src/api/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';
const REQUEST_TIMEOUT = 15000; // 15 seconds
const AUTH_TOKEN_STORAGE_KEY = 'token'; // Consistent key - CHANGED FROM 'authToken'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    // <<< --- ADDED LOGS --- >>>
    console.log(`[Axios Interceptor Request] Target URL: ${config.url}`);
    console.log(`[Axios Interceptor Request] Token from localStorage ('${AUTH_TOKEN_STORAGE_KEY}'):`, token ? `Found (length: ${token.length})` : 'NOT Found');

    if (token) {
      if (!config.headers['Authorization']) { // Only add if not already present
          console.log('[Axios Interceptor Request] Adding Authorization header.'); // Log before adding
          config.headers['Authorization'] = `Bearer ${token}`;
      } else {
          console.log('[Axios Interceptor Request] Authorization header was already present:', config.headers['Authorization']);
      }
    } else {
        console.log('[Axios Interceptor Request] No token found in localStorage to attach.');
    }
    // <<< --- END OF ADDED LOGS --- >>>
    return config;
  },
  (error) => {
    console.error("Axios Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log('[Axios Interceptor Response] Received response for:', response.config.url, response.status); // Optional: log successful responses
    return response;
  },
  (error) => {
    console.error('[Axios Interceptor Response] Error encountered.'); // General marker
    if (error.response) {
      const { status, data, config: { url } } = error.response; // Destructure url from config
      console.warn(`[Axios Interceptor Response] Server responded for ${url} with status ${status}.`);
      if (status === 401) {
        console.warn(`Axios Response Interceptor: Caught 401 Unauthorized from server for URL: ${url}. Dispatching auth-error-401.`);
        window.dispatchEvent(new CustomEvent('auth-error-401', {
          detail: { message: data?.message || 'Your session has expired or is invalid. Please log in again.' }
        }));
      } else if (status === 403) {
        console.warn(`Axios Response Interceptor: Caught 403 Forbidden from server for URL: ${url}.`);
      } else if (status >= 500) {
        console.error(`Axios Response Interceptor: Caught Server Error ${status} for URL: ${url}.`, error.response);
      }
    } else if (error.request) {
      console.error(`Axios Response Interceptor: Network Error - No response received for request to ${error.config?.url || 'unknown URL'}.`, error.request);
    } else {
      console.error(`Axios Response Interceptor: Error setting up request for ${error.config?.url || 'unknown URL'}.`, error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;