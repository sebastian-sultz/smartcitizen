import { UserResponse } from "@/features/shared/auth/types";

export interface DashboardStats {
  total_amount: number;
  total_referrals: number;
  campaigns_joined: number;
  badge_level: string;
  events_attended: number;
  volunteer_status: 'not_applied' | 'pending' | 'approved' | 'rejected';
}

export interface ReferralStats {
  total_referrals: number;
  referral_payment_count: number;
  total_contribution_generated: number;
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
}

export interface CreateSupportTicketPayload {
  category: 'account' | 'donation' | 'volunteer' | 'technical' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
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
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  report_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  reporter_user_id: string;
  reported_user_id: string;
  reason: string;
  status: 'Open' | 'Resolved' | 'Closed';
  action_taken?: string | null;
  resolved_at?: string | null;
  created_at: string;
  messages?: TicketMessage[];
}

export interface FAQItem {
  id: string;
  category: 'general' | 'donation' | 'volunteer' | 'account';
  question: string;
  answer: string;
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

export interface ReportResponse {
  report: SupportTicket;
}

export interface ReportMessagesResponse {
  messages: TicketMessage[];
}

export interface AddMessageResponse {
  data: TicketMessage;
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
  purpose: string;
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
  donorLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export interface RecurringDonation {
  id: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  purpose: string;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: string;
  paymentMethod: string;
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



