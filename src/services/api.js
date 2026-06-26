import axios from 'axios';
import { auth } from '../firebase/config';

// URL de producción de Render
const PRODUCTION_API_URL = 'https://backend-buscolaburo.onrender.com/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || PRODUCTION_API_URL,
});

// Interceptor para agregar el Firebase ID Token a cada request
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Forzamos el refresco del token si es necesario (true) para evitar tokens expirados
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error obteniendo token fresco:', error);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Ocurrió un error inesperado.';
    
    if (error.response) {
      // Error 401: Sesión expirada o token inválido
      if (error.response.status === 401) {
        message = error.response.data?.error || 'Sesión no autorizada.';
      } else {
        message = error.response.data?.error || message;
      }
    } else if (error.request) {
      message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }

    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default api;
