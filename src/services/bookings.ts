import { apiGet } from './api';
import type { ApiBooking } from '../types/api';

export const fetchMyBookings = async (): Promise<ApiBooking[]> => {
  try {
    return await apiGet<ApiBooking[]>('/bookings');
  } catch {
    return [];
  }
};

export const fetchBookingById = async (id: string): Promise<ApiBooking> =>
  apiGet<ApiBooking>(`/bookings/${id}`);
