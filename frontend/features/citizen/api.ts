import {
  DashboardStats,
  ActivityItem,
  DonationRecord,
  DonationStats,
  RecurringDonation,
  TaxCertificate,
  ReferralMember,
  ReferralStats,
  MemberProfile,
  SupportTicket,
  FAQItem,
  VolunteerEligibility,
} from './types';
import {
  mockDashboardStats,
  mockActivityTimeline,
  mockDonationRecords,
  mockDonationStats,
  mockRecurringDonations,
  mockTaxCertificates,
  mockReferralMembers,
  mockReferralStats,
  mockMemberProfile,
  mockSupportTickets,
  mockFAQs,
  mockVolunteerEligibility,
} from './mock-data';

const delay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await delay();
  return { ...mockDashboardStats };
};

export const getActivityTimeline = async (): Promise<ActivityItem[]> => {
  await delay();
  return [...mockActivityTimeline];
};

export const getDonationHistory = async (filters?: {
  status?: string;
  purpose?: string;
  search?: string;
}): Promise<DonationRecord[]> => {
  await delay(600);
  let list = [...mockDonationRecords];

  if (filters?.status && filters.status !== 'all') {
    list = list.filter((d) => d.status === filters.status);
  }
  if (filters?.purpose && filters.purpose !== 'all') {
    list = list.filter((d) => d.purpose === filters.purpose);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (d) =>
        d.transactionId.toLowerCase().includes(q) ||
        d.purpose.toLowerCase().includes(q)
    );
  }

  return list;
};

export const getDonationStats = async (): Promise<DonationStats> => {
  await delay();
  return { ...mockDonationStats };
};

export const getRecurringDonations = async (): Promise<RecurringDonation[]> => {
  await delay();
  return [...mockRecurringDonations];
};

export const getTaxCertificates = async (): Promise<TaxCertificate[]> => {
  await delay();
  return [...mockTaxCertificates];
};

export const getReferralStats = async (): Promise<ReferralStats> => {
  await delay();
  return { ...mockReferralStats };
};

export const getReferredMembers = async (filters?: {
  status?: string;
  search?: string;
}): Promise<ReferralMember[]> => {
  await delay(500);
  let list = [...mockReferralMembers];

  if (filters?.status && filters.status !== 'all') {
    list = list.filter((m) => m.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((m) => m.name.toLowerCase().includes(q));
  }

  return list;
};

let sessionTickets = [...mockSupportTickets];
let sessionProfile = { ...mockMemberProfile };
let sessionEligibility = { ...mockVolunteerEligibility };

export const getMemberProfile = async (): Promise<MemberProfile> => {
  await delay();
  return { ...sessionProfile };
};

export const updateMemberProfile = async (
  profileData: Partial<MemberProfile>
): Promise<MemberProfile> => {
  await delay(500);
  sessionProfile = { ...sessionProfile, ...profileData };
  return { ...sessionProfile };
};

export const getSupportTickets = async (): Promise<SupportTicket[]> => {
  await delay(400);
  return [...sessionTickets];
};

export const createSupportTicket = async (ticketData: {
  category: 'account' | 'donation' | 'volunteer' | 'technical' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}): Promise<SupportTicket> => {
  await delay(600);
  const newTicket: SupportTicket = {
    id: `tkt_${Date.now()}`,
    ticketId: `SC-${Math.floor(1000 + Math.random() * 9000)}`,
    category: ticketData.category,
    subject: ticketData.subject,
    description: ticketData.description,
    priority: ticketData.priority,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: `msg_${Date.now()}`,
        sender: 'user',
        senderName: sessionProfile.name,
        content: ticketData.description,
        timestamp: new Date().toISOString(),
      },
    ],
  };
  sessionTickets = [newTicket, ...sessionTickets];
  return newTicket;
};

export const replyToTicket = async (
  ticketId: string,
  content: string
): Promise<SupportTicket | null> => {
  await delay(400);
  const ticketIdx = sessionTickets.findIndex((t) => t.id === ticketId);
  if (ticketIdx === -1) return null;

  const ticket = sessionTickets[ticketIdx];
  const newMessage = {
    id: `msg_${Date.now()}`,
    sender: 'user' as const,
    senderName: sessionProfile.name,
    content,
    timestamp: new Date().toISOString(),
  };

  const updatedTicket = {
    ...ticket,
    status: 'open' as const,
    updatedAt: new Date().toISOString(),
    messages: [...ticket.messages, newMessage],
  };

  sessionTickets[ticketIdx] = updatedTicket;

  return updatedTicket;
};

export const getVolunteerEligibility = async (): Promise<VolunteerEligibility> => {
  await delay();
  return { ...sessionEligibility };
};

export const applyForVolunteer = async (volunteerPayload: {
  skills: string[];
  availability: string;
  interest: string;
  workType: string;
  motivation: string;
}): Promise<boolean> => {
  await delay(700);
  sessionEligibility = {
    ...sessionEligibility,
  };
  return true;
};

export const getFAQs = async (category?: string): Promise<FAQItem[]> => {
  await delay();
  let list = [...mockFAQs];
  if (category && category !== 'all') {
    list = list.filter((faq) => faq.category === category);
  }
  return list;
};
