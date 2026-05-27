import { apiGet, apiPost } from './api';
import type { ApiWithdrawal, WithdrawalType } from '../types/api';

export const fetchWithdrawals = async (): Promise<ApiWithdrawal[]> => {
  try {
    return await apiGet<ApiWithdrawal[]>('/withdrawals');
  } catch {
    return [];
  }
};

export const requestWithdrawal = async (type: WithdrawalType): Promise<ApiWithdrawal> => {
  return apiPost<ApiWithdrawal>('/withdrawals', { type });
};
