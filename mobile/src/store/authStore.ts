import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../services/api';
import { User } from '../types';

interface RegisterPayload {
  username: string;
  name?: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  initAuth: async () => {
    try {
      set({ isInitializing: true });
      const [storedToken, storedUser] = await AsyncStorage.multiGet([
        TOKEN_STORAGE_KEY,
        USER_STORAGE_KEY,
      ]);

      const token = storedToken[1];
      const user = storedUser[1] ? JSON.parse(storedUser[1]) : null;

      if (token && user) {
        set({ token, user, isInitializing: false });
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data && res.data.user) {
            set({ user: res.data.user });
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
          }
        } catch (e) {
          // Keep offline session
        }
      } else {
        set({ token: null, user: null, isInitializing: false });
      }
    } catch (err) {
      console.warn('Error during initAuth:', err);
      set({ token: null, user: null, isInitializing: false });
    }
  },

  login: async (identifier: string, password: string): Promise<boolean> => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.post('/auth/login', {
        identifier: identifier.trim(),
        password,
      });
      const { token, user } = res.data;

      await AsyncStorage.multiSet([
        [TOKEN_STORAGE_KEY, token],
        [USER_STORAGE_KEY, JSON.stringify(user)],
      ]);

      set({ token, user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  register: async (payload: RegisterPayload): Promise<boolean> => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.post('/auth/register', {
        username: payload.username.trim(),
        name: (payload.name || payload.username).trim(),
        email: payload.email.trim(),
        password: payload.password,
      });
      const { token, user } = res.data;

      await AsyncStorage.multiSet([
        [TOKEN_STORAGE_KEY, token],
        [USER_STORAGE_KEY, JSON.stringify(user)],
      ]);

      set({ token, user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
    } catch (e) {
      console.warn('Error during logout:', e);
    }
    set({ token: null, user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
