import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';
const REQUEST_TIMEOUT = 15000; 
const AUTH_TOKEN_STORAGE_KEY = 'token'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: REQUEST_TIMEOUT,
  headers: {

  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {

      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {

      }
    } else {
    }
    return config;
  },
  (error) => {
    console.error("[Axios Req Error]", error.config?.url, error.message, error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response; 
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

    } else {
      console.error(`[Axios Res Error] Error setting up request for URL: ${requestUrl}`, error.message);
    }
    return Promise.reject(error); 
  }
);

export default axiosInstance;