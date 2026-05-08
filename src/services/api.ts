import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Requerido para que el navegador envíe httpOnly cookies
});

// Interceptor de request — las cookies se adjuntan automáticamente por el navegador
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/**
 * Flag para evitar loops infinitos: si el refresh falla, no volvemos a intentarlo.
 * isRefreshing previene múltiples llamadas simultáneas al endpoint /refresh.
 */
let isRefreshing = false;

// Interceptor de response — maneja renovación automática del access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry && // No reintentar la misma request dos veces
      originalRequest.url !== '/auth/me' && // Evitar redirect en la verificación inicial de sesión
      originalRequest.url !== '/auth/refresh' // Evitar loop si el refresh mismo falla
    ) {
      // Marcar la request para no reintentar si el refresh también falla
      originalRequest._retry = true;

      if (isRefreshing) {
        // Si ya hay un refresh en curso, rechazar para no duplicar llamadas
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        // Intentar renovar el access token de forma silenciosa
        await api.post('/auth/refresh');

        // Si el refresh fue exitoso, reintentar la petición original
        return api(originalRequest);
      } catch {
        // El refresh token también expiró: la sesión terminó definitivamente
        toast.error('Tu sesión expiró, inicia sesión nuevamente');
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
