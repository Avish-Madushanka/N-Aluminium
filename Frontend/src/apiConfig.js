const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

const API_ENDPOINTS = {
  CLIENT: {
    REGISTER: `${API_BASE_URL}/clients/register`,
  },
  BOWNERS: {
    REGISTER: `${API_BASE_URL}/b-owners/register`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  BACKEND_ROOT_URL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', '')
};

export default API_ENDPOINTS;