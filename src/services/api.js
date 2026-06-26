import axios from 'axios';
import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-buscolaburo.onrender.com/api',
});

// Interceptor para agregar el Firebase ID Token a cada request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Ocurrió un error inesperado.';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default api;
