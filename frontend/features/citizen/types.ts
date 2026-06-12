import { UserResponse } from "@/features/shared/auth/types";

export interface DashboardStats {
  total_amount: number;
  total_referrals: number;
  events_attended: number;
}

export interface ReferralStats {
  total_referrals: number;
  referral_payment_count: number;
  total_contribution_generated?: number;
  referral_code: string;
  referral_link: string;
}

export interface VolunteerEligibility {
  total_referrals: number;
  referral_payment_count: number;
  is_eligible: boolean;
  required_referrals: number;
  required_payments: number;
}

export interface CreateVolunteerPayload {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  address: string;
  city: string;
  district: string;
  pincode: string;
  profession: string;
  experience: string;
  ispublicconsent?: boolean;
}

export interface UpdateVolunteerPayload {
  name?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  address?: string;
  city?: string;
  district?: string;
  pincode?: string;
  profession?: string;
  experience?: string;
  ispublicconsent?: boolean;
}


export interface SocialLinksPayload {
  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;
}

export interface Volunteer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  address: string;
  city: string;
  district: string;
  pincode: string;
  profession: string;
  experience: string;
  ispublicconsent: boolean;
  image: string | null;
  created_at: string;
  updated_at: string;
}


// API Response interfaces
export interface UserProfileResponse {
  user: UserResponse;
}

export interface VolunteersListResponse {
  volunteers: Volunteer[];
}

export interface VolunteerResponse {
  volunteer: Volunteer;
}


export interface ActivityItem {
  id: string;
  type: 'donation' | 'referral_join' | 'referral_donate' | 'event_register' | 'volunteer_apply' | 'ticket_update';
  title: string;
  description: string;
  date: string;
  amount?: number;
  status?: string;
}

export interface DonationRecord {
  id: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  receiptUrl?: string;
  taxCertificateUrl?: string;
}

export interface DonationStats {
  lifetimeDonated: number;
  donatedThisYear: number;
  donatedLastMonth: number;
  totalTransactions: number;
  averageAmount: number;
}

export interface TaxCertificate {
  id: string;
  fiscalYear: string;
  amount: number;
  status: 'generated' | 'pending';
  downloadUrl: string;
}

export interface ReferralMember {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'invited' | 'registered' | 'active';
  donationStatus: 'none' | 'donated';
  totalDonated: number;
  registrationDate: string;
  lastActivityDate: string;
  membershipStatus: 'active' | 'inactive';
}

export interface Payment {
  id: string;
  userId?: string;
  merchantOrderId: string;
  providerReferenceId?: string;
  amount: number; // in paise
  status: string; // SUCCESS, FAILED, PENDING, CANCELLED
  paymentMethod?: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendPagination {
  limit: number;
  page: number;
  total_rows: number;
  total_pages: number;
}

export interface PaymentHistoryResponse {
  data: Payment[];
  pagination: BackendPagination;
}

export interface InitiatePaymentRequest {
  amount: number;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
}


