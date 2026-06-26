import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (token: string, user: AuthUser) => {
        set({ token, user, isAuthenticated: true, isLoading: false });
      },

      setUser: (user: AuthUser) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },

      clearAuth: () => {
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'atena-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
