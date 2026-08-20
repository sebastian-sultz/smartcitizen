import { Payment, PhonepeResponse } from "@/features/citizen/types";

export interface PaymentAdminResponse extends Payment {
  receiptNumber?: string;
  phonepeResponse?: PhonepeResponse;
}

export interface UserNetworkStats {
  directReferralsCount: number;
  totalDownlineCount: number;
  directReferralDonationAmount: number;
  totalNetworkDonationAmount: number;
}

export interface ReferralNetworkMember {
  id: string;
  memberId?: string;
  name: string;
  phone: string;
  role?: string;
  status?: string;
  level: number;
  sponsorName?: string;
  sponsorMemberId?: string;
  directReferralsCount?: number;
  directReferralRevenue?: number;
  downlineTreeSize?: number;
  totalDirectDonations: number;
  totalNetworkDonations: number;
  joinedAt: string;
}

export interface PaginationInfo {
  limit: number;
  page: number;
  total_rows: number;
  total_pages: number;
}

export interface UserNetworkResponse {
  userId: string;
  referrals: ReferralNetworkMember[];
  pagination?: PaginationInfo;
}

export interface RegistrationGrowth {
  month: string;
  count: number;
}

export interface DonationGrowth {
  month: string;
  total: number;
}

export interface VolunteerActivityCount {
  category: string;
  status: string;
  count: number;
}

export interface ReceiptComplianceStats {
  successPayments: number;
  generatedCount: number;
  pendingCount: number;
}

export interface AdminAnalyticsResponse {
  registrationGrowth: RegistrationGrowth[];
  donationGrowth: DonationGrowth[];
  volunteerActivity: VolunteerActivityCount[];
  receiptStats: ReceiptComplianceStats;
}

export interface UserFilterParams {
  q?: string;
  sort?: string;
  role?: string;
  is_suspended?: boolean | string;
  min_referrals?: number | string;
  max_referrals?: number | string;
  min_payments?: number | string;
  max_payments?: number | string;
  min_amount?: number | string;
  max_amount?: number | string;
  joined_before?: string;
  joined_after?: string;
  referrals_only?: boolean;
}

export interface VolunteerFilterParams {
  q?: string;
  profession?: string;
  state?: string;
  city?: string;
  status?: string;
  sort?: string;
  startDate?: string;
  endDate?: string;
  onlyApproved?: boolean;
}

export interface PaymentFilterParams {
  userId?: string;
  search?: string;
  status?: string;
  taxExemption?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

