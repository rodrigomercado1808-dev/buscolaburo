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
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error obteniendo token:', error);
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
      // El servidor respondió con un status fuera del rango 2xx
      message = error.response.data?.error || message;
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (ej: error de conexión)
      message = 'No se pudo conectar con el servidor. Verifica tu conexión o si el backend está activo.';
    }

    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default api;
