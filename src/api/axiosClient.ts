import axios from 'axios';

// Create a custom event for auth errors
export const authErrorEvent = new Event('auth:unauthorized');

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Attach JWT token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Default error message
    let errorMessage = 'An unexpected error occurred';

    if (response) {
      // Use server provided error message if available
      if (response.data && response.data.error) {
        errorMessage = response.data.error;
      } else if (response.data && response.data.message) {
        errorMessage = response.data.message;
      }
      
      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Dispatch event so App can listen and logout
          window.dispatchEvent(authErrorEvent);
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    }

    // Attach formatted error message to the error object
    error.message = errorMessage;
    
    return Promise.reject(error);
  }
);

export default axiosClient;
