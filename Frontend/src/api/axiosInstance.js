import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';
const REQUEST_TIMEOUT = 15000; 
const AUTH_TOKEN_STORAGE_KEY = 'token'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    console.log(`[Axios Req] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("[Axios Req Error]", error.config?.url, error.message, error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Axios Res] ${response.status} ${response.config.url}`);
    return response; 
  },
  (error) => {
    const config = error.config || {};
    const requestUrl = config.baseURL ? `${config.baseURL.replace(/\/$/, '')}/${(config.url || '').replace(/^\//, '')}` : config.url || 'unknown URL';

    console.error(`[Axios Res Error] for ${requestUrl}`);

    if (error.response) {
      const { status, data } = error.response;
      console.warn(`[Axios Res Error] Server responded with Status: ${status}`);
      console.warn(`[Axios Res Error] Response data:`, JSON.stringify(data, null, 2));

      if (status === 401) {
        console.warn(`[Axios Res Error] 401 Unauthorized. URL: ${requestUrl}`);
        window.dispatchEvent(new CustomEvent('auth-error-401', {
          detail: { message: data?.message || 'Your session has expired or is invalid. Please log in again.' }
        }));
      } else if (status === 403) {
        console.warn(`[Axios Res Error] 403 Forbidden. URL: ${requestUrl}`);
      } else if (status === 404) {
        console.warn(`[Axios Res Error] 404 Not Found. URL: ${requestUrl}`);
        console.warn(`[Axios Res Error] Check if backend route exists: ${requestUrl}`);
      } else if (status >= 500) {
        console.error(`[Axios Res Error] Server Error ${status}. URL: ${requestUrl}`, data);
      }
    } else if (error.request) {
      console.error(`[Axios Res Error] Network Error or No Response from server for URL: ${requestUrl}`, error.message);
    } else {
      console.error(`[Axios Res Error] Error setting up request for URL: ${requestUrl}`, error.message);
    }
    return Promise.reject(error); 
  }
);

export default axiosInstance;