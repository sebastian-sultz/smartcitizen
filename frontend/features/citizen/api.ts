import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { UserResponse } from "../shared/auth/types";
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
  Payment,
  PaymentHistoryResponse,
  InitiatePaymentRequest,
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

export const getDonationHistory = async (): Promise<Payment[]> => {
  try {
    const response = await api.get<PaymentHistoryResponse>("/payments/history?page=1&limit=100");
    return response.data.data || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to load donation history");
  }
};

export const getDonationStats = async (): Promise<DonationStats> => {
  try {
    const response = await api.get<DonationStats>("/payments/stats");
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load donation stats");
  }
};

export const getTaxCertificates = async (): Promise<TaxCertificate[]> => {
  try {
    const response = await api.get<{ certificates: TaxCertificate[] }>("/payments/certificates");
    return response.data.certificates || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to load tax certificates");
  }
};

export const initiatePayment = async (
  payload: InitiatePaymentRequest
): Promise<{ redirectUrl: string; merchantOrderId: string }> => {
  try {
    const response = await api.post<{ redirectUrl: string; merchantOrderId: string }>(
      "/payments/initiate",
      payload
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to initiate payment");
  }
};

export const getPaymentStatus = async (
  transactionId: string
): Promise<Payment> => {
  try {
    const response = await api.get<Payment>(`/payments/status/${transactionId}`);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load payment status");
  }
};

export const getReferredMembers = async (userId: string): Promise<UserResponse[]> => {
  try {
    const response = await api.get<{ users: UserResponse[] }>(`/users/${userId}/referred`);
    return response.data.users || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to load referred members");
  }
};

export const getFAQs = async (category?: string): Promise<FAQItem[]> => {
  await delay();
  return [];
};
