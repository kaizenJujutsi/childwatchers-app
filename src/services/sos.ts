import { apiGet, apiPost } from './api';
import type { ApiSosEvent, ApiZoneAlert } from '../types/api';

export const triggerSOS = (): Promise<ApiSosEvent> =>
  apiPost<ApiSosEvent>('/sos', {});

export const fetchZoneAlerts = async (): Promise<ApiZoneAlert[]> => {
  try {
    return await apiGet<ApiZoneAlert[]>('/zones/alerts');
  } catch {
    return [];
  }
};

export const postZoneAlert = (
  type: 'amber' | 'info' | 'resolved',
  message: string
): Promise<ApiZoneAlert> =>
  apiPost<ApiZoneAlert>('/zones/alerts', { type, message });
