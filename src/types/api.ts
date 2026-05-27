export type Role = 'parent' | 'watcher';

export type City = 'Nairobi' | 'Mombasa' | 'Kisumu' | 'Nakuru' | 'Eldoret';

export interface ApiUser {
  id: string;
  email: string;
  role: Role;
  full_name: string;
  phone: string;
  zone: string;
  city: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface WatcherListItem {
  id: string;
  name: string;
  photo_url: string;
  rating: number;
  review_count: number;
  rate_per_hour: number;
  zone: string;
  specialties: string[];
  vetting_complete: boolean;
}

export interface BookingPayload {
  watcher_id: string;
  date: string;
  start_time: string;
  hours: number;
}

export interface BookingResponse {
  id: string;
  status: 'pending' | 'confirmed' | 'active' | 'complete' | 'cancelled';
  watcher_id: string;
  parent_id: string;
  total_kes: number;
  escrow_ref: string;
}

export interface ChildProfile {
  child_name: string;
  child_dob: string;
  birth_cert_number: string;
  photo_url?: string;
}

export interface ParentKYC {
  national_id: string;
  child: ChildProfile;
  status: 'pending' | 'verified' | 'rejected';
  submitted_at?: string;
}

export type AlertType = 'red' | 'amber' | 'info' | 'resolved';
export type AlertStatus = 'active' | 'removed';

export interface ApiSosEvent {
  id: string;
  user_id: string;
  zone: string;
  city: string;
  status: string;
  created_at: string;
}

export interface ApiZoneAlert {
  id: string;
  zone: string;
  city: string;
  type: AlertType;
  message: string;
  reported_by: string;
  posted_by_user_id: string | null;
  status: AlertStatus;
  created_at: string;
}
