import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  user_type: string;
  is_email_verified: boolean;
  first_name?: string;
  last_name?: string;
  name?: string;
  profile_picture_url?: string;
  logo_url?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  userType: 'athlete' | 'club' | null;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setUserType: (type: 'athlete' | 'club' | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // Solo leemos de localStorage si estamos en el cliente (navegador)
  token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  userType: typeof window !== 'undefined' ? localStorage.getItem('user_type') as 'athlete' | 'club' | null : null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
    set({ token });
  },
  
  setUserType: (type) => {
    if (type) {
      localStorage.setItem('user_type', type);
    } else {
      localStorage.removeItem('user_type');
    }
    set({ userType: type });
  },

  setIsLoading: (isLoading) => set({ isLoading }),
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    set({ user: null, token: null, userType: null });
  },
}));
