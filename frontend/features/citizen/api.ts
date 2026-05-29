import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import {
  ActivityItem,
  DonationRecord,
  DonationStats,
  RecurringDonation,
  TaxCertificate,
  ReferralMember,
  Volunteer,
  SupportTicket,
  FAQItem,
  UserProfileResponse,
  VolunteersListResponse,
  VolunteerResponse,
  ReportResponse,
  ReportMessagesResponse,
  AddMessageResponse,
  VolunteerEligibility,
  CreateVolunteerPayload,
  UpdateVolunteerPayload,
} from './types';
import {
  mockActivityTimeline,
  mockDonationRecords,
  mockDonationStats,
  mockRecurringDonations,
  mockTaxCertificates,
  mockReferralMembers,
  mockFAQs,
} from './mock-data';

const delay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Direct REST API Wrappers ---

export const getMemberProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await api.get('/auth/profile/me');
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load user profile");
  }
};

export const getVolunteers = async (): Promise<VolunteersListResponse> => {
  try {
    const response = await api.get('/volunteers');
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load volunteers list");
  }
};

export const createVolunteer = async (
  payload: CreateVolunteerPayload
): Promise<VolunteerResponse> => {
  try {
    const response = await api.post('/volunteers', payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to create volunteer");
  }
};

export const updateVolunteer = async (
  id: string,
  payload: UpdateVolunteerPayload
): Promise<VolunteerResponse> => {
  try {
    const response = await api.put(`/volunteers/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to update volunteer");
  }
};

export const getReport = async (id: string): Promise<ReportResponse> => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load support ticket");
  }
};

export const createReport = async (payload: {
  reported_user_id: string;
  reason: string;
}): Promise<ReportResponse> => {
  try {
    const response = await api.post('/reports', payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to create support ticket");
  }
};

export const addReportMessage = async (
  reportId: string,
  payload: { message: string }
): Promise<AddMessageResponse> => {
  try {
    const response = await api.post(`/reports/${reportId}/messages`, payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to send message");
  }
};

export const getReportMessages = async (reportId: string): Promise<ReportMessagesResponse> => {
  try {
    const response = await api.get(`/reports/${reportId}/messages`);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load messages");
  }
};

// --- Mock-only Mappings ---

export const getActivityTimeline = async (): Promise<ActivityItem[]> => {
  await delay();
  return [...mockActivityTimeline];
};

export const getDonationHistory = async (): Promise<DonationRecord[]> => {
  await delay();
  return [...mockDonationRecords];
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

export const getReferredMembers = async (): Promise<ReferralMember[]> => {
  await delay();
  return [...mockReferralMembers];
};

export const getFAQs = async (category?: string): Promise<FAQItem[]> => {
  await delay();
  let list = [...mockFAQs];
  if (category && category !== 'all') {
    list = list.filter((faq) => faq.category === category);
  }
  return list;
};
