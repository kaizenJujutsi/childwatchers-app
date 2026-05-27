import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ApiUser, AuthResponse } from '../types/api';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getToken,
} from '../services/auth';
import { registerPushToken } from '../services/pushNotifications';

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  loginUser(email: string, password: string): Promise<ApiUser>;
  registerUser(
    email: string,
    password: string,
    full_name: string,
    phone: string,
    role: 'parent' | 'watcher',
    zone: string,
    city: string
  ): Promise<ApiUser>;
  logoutUser(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          const [, payload] = storedToken.split('.');
          const decoded = payload ? JSON.parse(atob(payload)) : null;
          setToken(storedToken);
          setUser(decoded?.user ?? decoded ?? null);
        }
      } catch (error) {
        console.warn('Failed to initialize auth state', error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, []);

  const loginUser = async (email: string, password: string): Promise<ApiUser> => {
    const response: AuthResponse = await loginApi(email, password);
    setUser(response.user);
    setToken(response.token);
    void registerPushToken();
    return response.user;
  };

  const registerUser = async (
    email: string,
    password: string,
    full_name: string,
    phone: string,
    role: 'parent' | 'watcher',
    zone: string,
    city: string
  ): Promise<ApiUser> => {
    const response: AuthResponse = await registerApi(
      email,
      password,
      full_name,
      phone,
      role,
      zone,
      city
    );
    setUser(response.user);
    setToken(response.token);
    void registerPushToken();
    return response.user;
  };

  const logoutUser = async (): Promise<void> => {
    await logoutApi();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
