import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import {
  ActivityItem,
  DonationRecord,
  DonationStats,
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

const delay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Direct REST API Wrappers ---

export const getMemberProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await api.get('/auth/me');
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

export const getUserReports = async (status?: string): Promise<SupportTicket[]> => {
  try {
    const url = status ? `/reports?status=${status}` : '/reports';
    const response = await api.get<{ reports: SupportTicket[] }>(url);
    return response.data.reports || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to load support tickets");
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
  title: string;
  description: string;
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

// --- Mock-only Mappings (stubbed to return empty defaults since mock data is removed) ---

export const getActivityTimeline = async (): Promise<ActivityItem[]> => {
  await delay();
  return [];
};

export const getDonationHistory = async (): Promise<DonationRecord[]> => {
  await delay();
  return [];
};

export const getDonationStats = async (): Promise<DonationStats> => {
  await delay();
  return {
    lifetimeDonated: 0,
    donatedThisYear: 0,
    donatedLastMonth: 0,
    totalTransactions: 0,
    averageAmount: 0,
    donorLevel: 'Bronze',
  };
};

export const getTaxCertificates = async (): Promise<TaxCertificate[]> => {
  await delay();
  return [];
};

export const getReferredMembers = async (): Promise<ReferralMember[]> => {
  await delay();
  return [];
};

export const getFAQs = async (category?: string): Promise<FAQItem[]> => {
  await delay();
  return [];
};
