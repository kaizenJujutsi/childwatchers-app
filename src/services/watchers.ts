import { apiGet } from './api';
import { Watcher, BASE_VETTING, WATCHERS } from '../data/mockWatchers';

interface WatcherApiItem {
  id: string;
  name: string;
  photo_url: string;
  rating: string | number;
  review_count: number;
  rate_per_hour: number;
  zone: string;
  specialties: string[] | null;
  bio: string | null;
  experience_yrs: number | null;
  languages: string[] | null;
  availability: string | null;
  vetting_complete: boolean;
}

function toWatcher(item: WatcherApiItem): Watcher {
  return {
    id: item.id,
    name: item.name,
    photo: item.photo_url,
    rating: typeof item.rating === 'string' ? parseFloat(item.rating) : item.rating,
    reviewCount: item.review_count,
    ratePerHour: item.rate_per_hour,
    zone: item.zone,
    specialties: item.specialties ?? [],
    vettingComplete: item.vetting_complete,
    experience: item.experience_yrs != null
      ? `${item.experience_yrs} year${item.experience_yrs !== 1 ? 's' : ''}`
      : '',
    bio: item.bio ?? '',
    availability: item.availability ?? '',
    languages: item.languages ?? [],
    age: 0,
    vettingSteps: item.vetting_complete ? BASE_VETTING : [],
    reviews: [],
  };
}

export const fetchWatchers = async (): Promise<Watcher[]> => {
  try {
    const items = await apiGet<WatcherApiItem[]>('/watchers');
    return items.map(toWatcher);
  } catch {
    return WATCHERS;
  }
};
