import api from "@/lib/axios";
import { AxiosRequestConfig } from "axios";
import { handleApiError } from "@/lib/api-helpers";
import { UserResponse } from "../shared/auth/types";
import {
  ActivityItem,
  DonationStats,
  TaxCertificate,
  UserProfileResponse,
  VolunteersListResponse,
  VolunteerResponse,
  CreateVolunteerPayload,
  UpdateVolunteerPayload,
  Payment,
  PaymentHistoryResponse,
  InitiatePaymentRequest,
  AddDirectMemberPayload,
} from "./types";

const delay = (ms: number = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface CustomRequestConfig extends AxiosRequestConfig {
  skipGlobalErrorToast?: boolean;
  skipAuthRedirect?: boolean;
}

export const getMemberProfile = async (): Promise<UserProfileResponse> => {
  try {
    const config: CustomRequestConfig = {
      skipAuthRedirect: true,
    };
    const response = await api.get("/auth/me", config);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load user profile");
  }
};

export const getVolunteers = async (): Promise<VolunteersListResponse> => {
  try {
    const response = await api.get("/volunteers");
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load volunteers list");
  }
};

export const createVolunteer = async (
  payload: CreateVolunteerPayload,
): Promise<VolunteerResponse> => {
  try {
    const response = await api.post("/volunteers", payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to create volunteer");
  }
};

export const updateVolunteer = async (
  id: string,
  payload: UpdateVolunteerPayload,
): Promise<VolunteerResponse> => {
  try {
    const response = await api.put(`/volunteers/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to update volunteer");
  }
};

export {
  getUserReports,
  getReport,
  createReport,
  addReportMessage,
  getReportMessages,
} from "@/features/shared/reports";

// --- Mock-only Mappings (stubbed to return empty defaults since mock data is removed) ---

export const getActivityTimeline = async (): Promise<ActivityItem[]> => {
  await delay();
  return [];
};

export const getDonationHistory = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
): Promise<PaymentHistoryResponse> => {
  try {
    let url = `/payments/history?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (status && status !== "ALL" && status !== "all") {
      url += `&status=${encodeURIComponent(status)}`;
    }
    const response = await api.get<PaymentHistoryResponse>(url);
    return response.data;
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
    const response = await api.get<{ certificates: TaxCertificate[] }>(
      "/payments/certificates",
    );
    return response.data.certificates || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to load tax certificates");
  }
};

export const initiatePayment = async (
  payload: InitiatePaymentRequest,
): Promise<{ redirectUrl: string; merchantOrderId: string }> => {
  try {
    const response = await api.post<{
      redirectUrl: string;
      merchantOrderId: string;
    }>("/payments/initiate", payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to initiate payment");
  }
};

export const getPaymentStatus = async (
  transactionId: string,
): Promise<Payment> => {
  try {
    const response = await api.get<Payment>(
      `/payments/status/${transactionId}`,
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load payment status");
  }
};

export const getReferredMembers = async (
  userId: string,
): Promise<UserResponse[]> => {
  try {
    const response = await api.get<{ users: UserResponse[] }>(
      `/users/${userId}/referred`,
    );
    return response.data.users || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to load referred members");
  }
};

interface CustomRequestConfig extends AxiosRequestConfig {
  skipGlobalErrorToast?: boolean;
}

export const getReceiptStatus = async (
  transactionId: string,
): Promise<{ url?: string; status?: string }> => {
  try {
    const config: CustomRequestConfig = {
      skipGlobalErrorToast: true,
    };
    const response = await api.get<{ url?: string; status?: string }>(
      `/payments/receipt/${transactionId}`,
      config,
    );
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateDonationTaxDetails = async (
  transactionId: string,
  payload: { donorPan: string; donorAddress: string },
): Promise<{ status: string }> => {
  try {
    const response = await api.put<{ status: string }>(
      `/payments/tax-details/${transactionId}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to update tax details");
  }
};

export const addDirectMember = async (
  payload: AddDirectMemberPayload,
): Promise<{ message: string; user: UserResponse }> => {
  try {
    const response = await api.post<{ message: string; user: UserResponse }>(
      "/users/direct",
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to add member directly");
  }
};
