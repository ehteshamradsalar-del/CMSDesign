import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, parseApiError } from './api';
import { STORAGE_KEY } from './constants';
import type { AuthResponse, User } from './types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; country?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface StoredAuth {
  token: string;
  user: User;
}

function loadStored(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    if (parsed?.token && parsed?.user) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setLoading(false);
  }, []);

  const persist = (data: StoredAuth) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data.user);
    setToken(data.token);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    persist(res.data);
  };

  const signup = async (data: { name: string; email: string; password: string; country?: string }) => {
    const res = await api.post<AuthResponse>('/auth/signup', data);
    persist(res.data);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, signup, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { parseApiError };
