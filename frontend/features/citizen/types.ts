export interface DashboardStats {
  totalDonated: number;
  totalReferrals: number;
  campaignsJoined: number;
  badgeLevel: string;
  eventsAttended: number;
  volunteerStatus: 'not_applied' | 'pending' | 'approved' | 'rejected';
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

export interface ReferralStats {
  totalInvited: number;
  joinedCount: number;
  activeDonorsCount: number;
  totalContributionGenerated: number;
  referralCode: string;
  referralLink: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  profilePhoto?: string;
  userType: 'member' | 'admin';
  memberId: string;
  joinDate: string;
  status: 'active' | 'inactive';
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  content: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  category: 'account' | 'donation' | 'volunteer' | 'technical' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface FAQItem {
  id: string;
  category: 'general' | 'donation' | 'volunteer' | 'account';
  question: string;
  answer: string;
}

export interface VolunteerEligibility {
  invitedCount: number;
  joinedCount: number;
  donatedCount: number;
  isEligible: boolean;
  requiredInvited: number;
  requiredJoined: number;
  requiredDonated: number;
}
