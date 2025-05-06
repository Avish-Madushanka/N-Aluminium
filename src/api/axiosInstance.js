// src/api/axiosInstance.js
import axios from 'axios';
// Assuming apiConfig.js defines BASE_URL and AUTH.LOGIN
import API_ENDPOINTS from '../apiConfig';

const axiosInstance = axios.create({
    baseURL: API_ENDPOINTS.BASE_URL,
    timeout: 15000, // Default timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// --- Request Interceptor (Add Token) ---
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Response Interceptor (Handle 401 Errors) ---
axiosInstance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
        const originalRequest = error.config;

        // --- Check for 401 Unauthorized ---
        if (error.response?.status === 401 && !originalRequest._retryAttempted) {
            console.warn('[Axios Interceptor] Received 401 Unauthorized.');
            originalRequest._retryAttempted = true; // Prevent retry loops if applicable

            // Don't trigger global logout for failed login attempts
            const loginPath = API_ENDPOINTS.AUTH.LOGIN.replace(API_ENDPOINTS.BASE_URL, '');
            if (!originalRequest.url?.includes(loginPath)) {
                console.log('[Axios Interceptor] Dispatching global logout event (auth-error-401).');
                // Dispatch custom event for App.jsx to catch
                window.dispatchEvent(new CustomEvent('auth-error-401', {
                    detail: {
                        message: error.response?.data?.error || error.response?.data?.message || 'Your session has expired or is invalid. Please log in again.'
                    }
                }));
            } else {
                 console.log('[Axios Interceptor] 401 on login path, not dispatching global logout.');
            }
        }

        // Reject the promise so the original caller's .catch() still works
        return Promise.reject(error);
    }
);

export default axiosInstance;