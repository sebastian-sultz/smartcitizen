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

export interface UserNetworkResponse {
  userId: string;
  referrals: ReferralNetworkMember[];
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
