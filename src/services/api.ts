import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config/env';

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await AsyncStorage.getItem('cw_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      message = json.message ?? message;
    } catch {}
    throw { message };
  }
  return res.json() as Promise<T>;
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, { method: 'GET', headers });
  return handleResponse<T>(res);
};

export const apiPost = async <T>(path: string, body: unknown): Promise<T> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
};

export const apiPatch = async <T>(path: string, body: unknown): Promise<T> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
};
