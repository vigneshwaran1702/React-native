import { create } from 'zustand';
import { apiClient, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (payload: { username?: string; name?: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  initAuth: async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user });
        const res = await apiClient.get('/auth/me');
        if (res.data?.user) {
          set({ user: res.data.user });
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
        }
      } catch (e) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        set({ token: null, user: null });
      }
    }
  },

  login: async (identifier, password) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.post('/auth/login', {
        identifier: identifier.trim(),
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({ token, user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Login failed. Please check your credentials.',
      });
      return false;
    }
  },

  register: async ({ username, name, email, password }) => {
    try {
      set({ isLoading: true, error: null });
      const cleanEmail = email.trim();
      const derivedUsername = username?.trim() || cleanEmail.split('@')[0] || name?.trim().toLowerCase().replace(/\s+/g, '') || 'user';
      const cleanName = name?.trim() || derivedUsername;

      const res = await apiClient.post('/auth/register', {
        username: derivedUsername,
        name: cleanName,
        email: cleanEmail,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({ token, user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.',
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    set({ token: null, user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
