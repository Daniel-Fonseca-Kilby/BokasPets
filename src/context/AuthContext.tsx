import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  role?: string;
  // Campos de foto de Cloudinary
  photo?: string;
  photoPublicId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; phone?: string; address?: string }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setUser: (user: User | null) => void;
  /** Actualiza solo la foto en el contexto sin recargar toda la sesión */
  updateUserPhoto: (photo: string, photoPublicId: string) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
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
    } catch (error) {
      console.error('Logout error', error);
      toast.error('Error al cerrar sesión');
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Actualiza la foto del usuario en el contexto de forma optimista.
   * Se llama desde Profile.tsx después de una subida exitosa para que
   * la Navbar refleje el cambio inmediatamente sin recargar la página.
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
