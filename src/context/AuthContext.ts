import { createContext } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  role?: string;
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
  updateUserPhoto: (photo: string, photoPublicId: string) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
