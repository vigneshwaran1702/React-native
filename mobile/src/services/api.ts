import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android Emulator uses 10.0.2.2 to access host localhost; iOS simulator and web use localhost
const DEFAULT_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';

export const TOKEN_STORAGE_KEY = '@todo_app_token';
export const USER_STORAGE_KEY = '@todo_app_user';

export const apiClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to retrieve token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handler
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    if (error.response && error.response.status === 401) {
      // Clean up local credentials on 401 Unauthorized
      try {
        await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
      } catch (storageError) {
        console.warn('Error clearing credentials on 401:', storageError);
      }
    }
    return Promise.reject(error);
  }
);
