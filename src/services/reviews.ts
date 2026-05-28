import { apiGet, apiPost } from './api';
import type { ApiReview } from '../types/api';

export const fetchWatcherReviews = async (watcherId: string): Promise<ApiReview[]> => {
  try {
    return await apiGet<ApiReview[]>(`/reviews?watcher_id=${encodeURIComponent(watcherId)}`);
  } catch {
    return [];
  }
};

export const submitReview = (
  bookingId: string,
  rating: number,
  comment?: string
): Promise<ApiReview> =>
  apiPost<ApiReview>('/reviews', {
    booking_id: bookingId,
    rating,
    ...(comment?.trim() ? { comment: comment.trim() } : {}),
  });
