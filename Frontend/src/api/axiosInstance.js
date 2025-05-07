import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';
const REQUEST_TIMEOUT = 15000; // 15 seconds
const AUTH_TOKEN_STORAGE_KEY = 'authToken'; // Consistent key

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      if (!config.headers['Authorization']) { // Only add if not already present
          config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Axios Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.warn('Axios Response Interceptor: Caught 401 Unauthorized from server.');
        window.dispatchEvent(new CustomEvent('auth-error-401', {
          detail: { message: data?.message || 'Your session has expired or is invalid. Please log in again.' }
        }));
      } else if (status === 403) {
        console.warn('Axios Response Interceptor: Caught 403 Forbidden.');
      } else if (status >= 500) {
        console.error('Axios Response Interceptor: Caught Server Error 5xx.', error.response);
      }
    } else if (error.request) {
      console.error('Axios Response Interceptor: Network Error - No response received.', error.request);
    } else {
      console.error('Axios Response Interceptor: Error setting up request.', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;