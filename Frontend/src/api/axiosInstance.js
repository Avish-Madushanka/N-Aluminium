// src/api/axiosInstance.js
// ... (imports and constants) ...

const axiosInstance = axios.create({ /* ... */ });

let activeRequests = 0;

const showLoader = () => {
    if (activeRequests === 0) {
        window.dispatchEvent(new CustomEvent('api-loading-start'));
    }
    activeRequests++;
};

const hideLoader = () => {
    activeRequests--;
    if (activeRequests === 0) {
        window.dispatchEvent(new CustomEvent('api-loading-stop'));
    }
};

axiosInstance.interceptors.request.use(
  (config) => {
    showLoader(); // Show loader before request
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    console.log(`[Axios Interceptor Request] Target URL: ${config.baseURL ? config.baseURL + config.url : config.url}`); // Log full URL
    console.log(`[Axios Interceptor Request] Token from localStorage ('${AUTH_TOKEN_STORAGE_KEY}'):`, token ? `Found (length: ${token.length})` : 'NOT Found');

    if (token) {
      if (!config.headers['Authorization']) {
          console.log('[Axios Interceptor Request] Adding Authorization header.');
          config.headers['Authorization'] = `Bearer ${token}`;
      } else {
          console.log('[Axios Interceptor Request] Authorization header was already present.');
      }
    } else {
        console.log('[Axios Interceptor Request] No token found in localStorage to attach.');
    }
    return config;
  },
  (error) => {
    hideLoader(); // Hide loader on request error
    console.error("Axios Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    hideLoader(); // Hide loader on successful response
    return response;
  },
  (error) => {
    hideLoader(); // Hide loader on response error
    console.error('[Axios Interceptor Response] Error encountered.');
    // ... (rest of your existing error handling logic) ...
    if (error.response) {
      const { status, data, config } = error.response;
      const url = config ? (config.baseURL ? config.baseURL + config.url : config.url) : 'unknown URL';
      console.warn(`[Axios Interceptor Response] Server responded for ${url} with status ${status}.`);
      if (status === 401) {
        console.warn(`Axios Response Interceptor: Caught 401 Unauthorized for URL: ${url}. Dispatching auth-error-401.`);
        window.dispatchEvent(new CustomEvent('auth-error-401', {
          detail: { message: data?.message || 'Your session has expired or is invalid. Please log in again.' }
        }));
      } else if (status === 403) {
        console.warn(`Axios Response Interceptor: Caught 403 Forbidden for URL: ${url}.`);
        // Optionally dispatch an event for 403 if you want global handling
        // window.dispatchEvent(new CustomEvent('api-error-403', { detail: { ... } }));
      } else if (status >= 500) {
        console.error(`Axios Response Interceptor: Caught Server Error ${status} for URL: ${url}.`, error.response);
      }
    } else if (error.request) {
      const url = error.config ? (error.config.baseURL ? error.config.baseURL + error.config.url : error.config.url) : 'unknown URL';
      console.error(`Axios Response Interceptor: Network Error - No response received for request to ${url}.`, error.request);
    } else {
      const url = error.config ? (error.config.baseURL ? error.config.baseURL + error.config.url : error.config.url) : 'unknown URL';
      console.error(`Axios Response Interceptor: Error setting up request for ${url}.`, error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;