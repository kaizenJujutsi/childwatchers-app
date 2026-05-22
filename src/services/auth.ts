import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from './api';
import { AuthResponse, ApiUser, Role } from '../types/api';

// In development, bypass the API and return a mock user so the app can be
// tested without the VPS backend being available.
const USE_DEV_MOCK = false;

function makeMockJWT(user: ApiUser): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ user, exp: Math.floor(Date.now() / 1000) + 604800 }));
  return `${header}.${payload}.dev-sig`;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  if (USE_DEV_MOCK) {
    const stored = await AsyncStorage.getItem('cw_dev_user');
    if (stored) {
      const user: ApiUser = JSON.parse(stored);
      if (user.email === email) {
        const token = makeMockJWT(user);
        await AsyncStorage.setItem('cw_token', token);
        return { token, user };
      }
    }
    throw { message: 'No dev account found for that email. Please register first.' };
  }
  const response = await apiPost<AuthResponse>('/auth/login', { email, password });
  await AsyncStorage.setItem('cw_token', response.token);
  return response;
};

export const register = async (
  email: string,
  password: string,
  full_name: string,
  phone: string,
  role: Role,
  zone: string,
  city: string
): Promise<AuthResponse> => {
  if (USE_DEV_MOCK) {
    const user: ApiUser = {
      id: `dev-${Date.now()}`,
      email,
      full_name,
      phone,
      role,
      zone,
      city,
      created_at: new Date().toISOString(),
    };
    await AsyncStorage.setItem('cw_dev_user', JSON.stringify(user));
    const token = makeMockJWT(user);
    await AsyncStorage.setItem('cw_token', token);
    return { token, user };
  }
  const response = await apiPost<AuthResponse>('/auth/register', {
    email, password, full_name, phone, role, zone, city,
  });
  await AsyncStorage.setItem('cw_token', response.token);
  return response;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('cw_token');
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem('cw_token');
};
