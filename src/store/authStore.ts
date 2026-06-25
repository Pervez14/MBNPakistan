// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'BUREAU_OWNER' | 'STAFF';
  accountStatus: string;
  subscriptionStatus: string;
  subscriptionEndDate?: string;
  badges: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isAdmin: false,

      setAuth: (user, accessToken) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isAdmin: user.role === 'ADMIN' || user.role === 'SUPER_ADMIN',
        });
        // Set default axios auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false, isAdmin: false });
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('refreshToken');
      },

      updateUser: (updates) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updates } });
        }
      },
    }),
    {
      name: 'mbn-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
