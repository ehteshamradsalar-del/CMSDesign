import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiError } from './types';
import { STORAGE_KEY } from './constants';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api: AxiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
});

interface StoredAuthShape {
    token: string;
    refreshToken?: string;
    user: unknown;
}

function readStoredAuth(): StoredAuthShape | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredAuthShape;
    } catch {
        return null;
    }
}

api.interceptors.request.use((config) => {
    const stored = readStoredAuth();
    if (stored?.token) {
        config.headers.Authorization = `Bearer ${stored.token}`;
    }
    return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
    const stored = readStoredAuth();
    if (!stored?.refreshToken) return null;

    try {
        const res = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken: stored.refreshToken,
        });
        const { token, refreshToken } = res.data as { token: string; refreshToken: string };

        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, token, refreshToken }));
        return token;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

        const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
        const alreadyRetried = originalRequest?._retry;

        if (error.response?.status === 401 && originalRequest && !isAuthEndpoint && !alreadyRetried) {
            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = performRefresh().finally(() => {
                    refreshPromise = null;
                });
            }

            const newToken = await refreshPromise;

            if (newToken) {
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            }

            localStorage.removeItem(STORAGE_KEY);
            window.location.href = '/login';
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