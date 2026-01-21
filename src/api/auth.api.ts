import axiosClient from './axiosClient';

// Define types if needed (or simply use any for quick setup, but explicit is better)
export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface SignupPayload {
  username?: string;
  email?: string;
  password?: string;
}

export const authApi = {
  login: async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (payload) => {
    // Adjust endpoint path if necessary, assuming /auth/signup based on context
    const response = await axiosClient.post('/auth/signup', payload);
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  getAllUsers: async () => {
    // Assuming admin endpoint is exposed at /auth/ or /users
    const response = await axiosClient.get('/auth/'); 
    return response.data;
  }
};
