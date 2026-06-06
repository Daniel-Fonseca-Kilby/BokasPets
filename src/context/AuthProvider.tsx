import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';
import type { User } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Usamos setTimeout para evitar que la llamada a fetchUser (y sus consecuentes setStates)
    // se realice de forma síncrona dentro del effect, eliminando alertas de renders en cascada.
    const timer = setTimeout(() => {
      fetchUser();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchUser]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = async (userData: any) => {
    const res = await api.post('/auth/login', userData);
    setUser(res.data);
    setIsAuthenticated(true);
  };

  const register = async (userData: { name: string; email: string; password: string; phone?: string; address?: string }) => {
    const res = await api.post('/auth/register', userData);
    setUser(res.data);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Sesión cerrada 👋');
    } catch {
      console.error('Logout error');
      toast.error('Error al cerrar sesión');
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Actualiza la foto del usuario en el contexto de forma optimista.
   */
  const updateUserPhoto = (photo: string, photoPublicId: string) => {
    if (user) {
      setUser({ ...user, photo, photoPublicId });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, setUser, updateUserPhoto }}>
      {children}
    </AuthContext.Provider>
  );
};
