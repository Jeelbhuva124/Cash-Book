import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  signup: (data) => api.post('/users/signup', data).then((res) => res.data),
  login: (data) => api.post('/users/login', data).then((res) => res.data),
  googleAuth: (data) => api.post('/users/google-auth', data).then((res) => res.data),
};

export default api;
