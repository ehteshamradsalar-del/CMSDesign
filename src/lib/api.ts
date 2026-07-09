import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiError } from './types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every outgoing request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('archive_auth');
  if (raw) {
    try {
      const token = JSON.parse(raw).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      /* ignore malformed storage */
    }
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('archive_auth');
    }
    return Promise.reject(error);
  }
);

export function parseApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    if (error.response?.status === 401) return 'Invalid email or password.';
    if (error.response?.status === 403) return 'You do not have permission to do that.';
    if (error.response?.status === 404) return 'That resource was not found.';
    if (error.code === 'ERR_NETWORK') return 'Cannot reach the server. Please check your connection.';
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export const apiOrigin = new URL(baseURL).origin;
