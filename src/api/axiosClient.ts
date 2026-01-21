import axios from 'axios';

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

    // Log request in development
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
    
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
      }
      
      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - Could trigger logout here if using global state store
          // errorMessage = 'Unauthorized access'; 
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 500:
          errorMessage = 'Internal Server Error. Please try again later.';
          break;
      }
    } else if (error.request) {
        // Network error (The request was made but no response was received)
        console.error("Network Error Details:", error);
        errorMessage = 'Network error. Server may be down or unreachable.';
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Axios Setup Error:", error.message);
        errorMessage = error.message;
    }

    console.error("API Error:", errorMessage, error.response?.data);

    // Normalize error object
    const customError = new Error(errorMessage);
    // Attach original response for further handling if needed
    (customError as any).response = response;
    
    return Promise.reject(customError);
  }
);

export default axiosClient;
