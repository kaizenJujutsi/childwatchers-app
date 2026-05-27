import { API_BASE } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadFile(
  localUri: string,
  filename: string,
  type: string,
  folder = 'uploads'
): Promise<UploadResult> {
  const token = await AsyncStorage.getItem('cw_token');
  const formData = new FormData();
  formData.append('file', { uri: localUri, name: filename, type } as unknown as Blob);
  formData.append('folder', folder);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `Upload failed: HTTP ${res.status}`);
  }

  return res.json() as Promise<UploadResult>;
}

// In dev mode, returns a fake upload result without hitting the VPS.
export async function uploadFileDev(localUri: string, filename: string): Promise<UploadResult> {
  return {
    url: localUri,
    key: `dev/${filename}`,
  };
}
