import { Volunteer } from "@/features/citizen/types";

export interface UserResponse {
  id: string;
  name: string;
  phone: string;
  profile_photo: string | null;
  user_type: string;
  total_payments: number;
  total_amount: number;
  referral_payment_count: number;
  referral_payment_amount: number;
  total_referrals: number;
  referral_id: string | null;
  total_events_registered: number;
  referral_name?: string | null;
  is_suspended: boolean;
  volunteer?: Volunteer | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: UserResponse;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  profile_photo?: string;
  referral_id?: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface ForgetPasswordPayload {
  phone: string;
  new_password?: string; // wait, backend is "new_password"
}

export interface ForgetPasswordResponse {
  message: string;
}

export interface SystemStatsResponse {
  total_users: number;
  total_payments: number;
  total_amount: number;
  total_referrals: number;
}

