import axios from 'axios';

/**
 * ============================================================================
 * AXIOS CONFIGURATION
 * Edit the baseURL and other default parameters below.
 * ============================================================================
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors (e.g., token expiry)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized (401), clean token and redirect to login
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');

        // Only redirect if not already on the login page
        if (!window.location.pathname.endsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Normalize error format for easier toast / alert usage
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
