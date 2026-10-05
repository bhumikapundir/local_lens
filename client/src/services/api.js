import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    const normalizedError = {
      status: error.response?.status || 0,
      message: data?.message || 'Network error. Please check your connection.',
      errors: data?.errors || [],
    };

    return Promise.reject(normalizedError);
  }
);

export default api;