import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { SupportTicket } from "@/features/shared/reports";
import { UserResponse } from "@/features/shared/auth/types";
import {
  PaymentAdminResponse,
  UserNetworkResponse,
  UserNetworkStats,
  AdminAnalyticsResponse,
  PaginationInfo,
  UserFilterParams,
  VolunteerFilterParams,
  PaymentFilterParams,
} from "./types";

export type {
  PaginationInfo,
  UserFilterParams,
  VolunteerFilterParams,
  PaymentFilterParams,
};

export const getAdminReports = async (
  status?: string,
): Promise<SupportTicket[]> => {
  try {
    const url = status ? `/admin/reports?status=${status}` : "/admin/reports";
    const response = await api.get<{ reports: SupportTicket[] }>(url);
    return response.data.reports || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to load moderation reports");
  }
};

export const resolveAdminReport = async (
  id: string,
  actionTaken: string,
): Promise<SupportTicket> => {
  try {
    const response = await api.put<{ report: SupportTicket }>(
      `/admin/reports/${id}/resolve`,
      {
        action_taken: actionTaken,
      },
    );
    return response.data.report;
  } catch (error: unknown) {
    handleApiError(error, "Failed to resolve report");
  }
};

export const getNonAdminUsers = async (
  page?: number,
  limit?: number,
  filters?: UserFilterParams,
): Promise<{ users: UserResponse[]; pagination?: PaginationInfo }> => {
  try {
    const response = await api.get<{
      users: UserResponse[];
      pagination?: PaginationInfo;
    }>("/users", {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load users list");
    throw error;
  }
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  try {
    const response = await api.get<{ user: UserResponse }>(
      `/auth/profile/${id}`,
    );
    return response.data.user;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load user profile");
    throw error;
  }
};

export const suspendUser = async (
  id: string,
  isSuspended: boolean,
): Promise<void> => {
  try {
    await api.put(`/users/${id}/suspend`, { is_suspended: isSuspended });
  } catch (error: unknown) {
    handleApiError(error, "Failed to update user suspension status");
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error: unknown) {
    handleApiError(error, "Failed to delete user");
    throw error;
  }
};

export const getAdminPaymentHistory = async (
  params?: PaymentFilterParams,
): Promise<{ data: PaymentAdminResponse[]; pagination?: PaginationInfo }> => {
  try {
    const response = await api.get<{
      data: PaymentAdminResponse[];
      pagination?: PaginationInfo;
    }>("/payments/history", {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load payment history");
    throw error;
  }
};

import { downloadBlob } from "@/lib/utils";

export const downloadPaymentsCSV = async (
  params?: PaymentFilterParams,
): Promise<void> => {
  try {
    const response = await api.get("/admin/payments/export", {
      params,
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `payments_export_${Date.now()}.csv`);
  } catch (error: unknown) {
    handleApiError(error, "Failed to export payments CSV");
    throw error;
  }
};

export const downloadPaymentsPDF = async (
  params?: PaymentFilterParams,
): Promise<void> => {
  try {
    const response = await api.get("/admin/payments/export-pdf", {
      params,
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    downloadBlob(blob, `payments_audit_${Date.now()}.pdf`);
  } catch (error: unknown) {
    handleApiError(error, "Failed to export payments PDF report");
    throw error;
  }
};

export const downloadForm10BDCSV = async (
  financialYear: string,
): Promise<void> => {
  try {
    const response = await api.get("/admin/payments/export-10bd", {
      params: { financialYear },
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `form_10bd_${financialYear}.csv`);
  } catch (error: unknown) {
    handleApiError(error, "Failed to export Form 10BD CSV");
    throw error;
  }
};

export const downloadUsersExport = async (
  format: "csv" | "pdf",
  filters?: UserFilterParams,
): Promise<void> => {
  try {
    const response = await api.get("/admin/users/export", {
      params: { ...filters, format },
      responseType: "blob",
    });
    const mimeType =
      format === "csv" ? "text/csv;charset=utf-8;" : "application/pdf";
    const extension = format === "csv" ? "csv" : "pdf";
    const blob = new Blob([response.data], { type: mimeType });
    downloadBlob(
      blob,
      `smartcitizens_${format === "pdf" ? "audit" : "export"}_${Date.now()}.${extension}`,
    );
  } catch (error: unknown) {
    handleApiError(error, `Failed to export users as ${format.toUpperCase()}`);
    throw error;
  }
};

export const downloadVolunteersExport = async (
  format: "csv" | "pdf",
  params?: VolunteerFilterParams,
): Promise<void> => {
  try {
    const response = await api.get("/admin/volunteers/export", {
      params: { ...params, format },
      responseType: "blob",
    });
    const mimeType =
      format === "csv" ? "text/csv;charset=utf-8;" : "application/pdf";
    const extension = format === "csv" ? "csv" : "pdf";
    const blob = new Blob([response.data], { type: mimeType });
    downloadBlob(
      blob,
      `volunteers_${format === "pdf" ? "audit" : "export"}_${Date.now()}.${extension}`,
    );
  } catch (error: unknown) {
    handleApiError(
      error,
      `Failed to export volunteers as ${format.toUpperCase()}`,
    );
    throw error;
  }
};

export const downloadUserNetworkExport = async (
  userId: string,
  format: "csv" | "pdf",
  recursive: boolean,
): Promise<void> => {
  try {
    const response = await api.get(`/admin/users/${userId}/network/export`, {
      params: { format, recursive },
      responseType: "blob",
    });
    const mimeType =
      format === "csv" ? "text/csv;charset=utf-8;" : "application/pdf";
    const extension = format === "csv" ? "csv" : "pdf";
    const blob = new Blob([response.data], { type: mimeType });
    const mode = recursive ? "multilevel_tree" : "direct_referrals";
    downloadBlob(
      blob,
      `network_${mode}_${userId.substring(0, 8)}_${Date.now()}.${extension}`,
    );
  } catch (error: unknown) {
    handleApiError(
      error,
      `Failed to export network as ${format.toUpperCase()}`,
    );
    throw error;
  }
};

export const downloadUserDossierPDF = async (
  userId: string,
  userName?: string,
): Promise<void> => {
  try {
    const response = await api.get(`/admin/users/${userId}/dossier-pdf`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const cleanName = userName
      ? userName.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : "citizen";
    downloadBlob(blob, `member_dossier_${cleanName}_${Date.now()}.pdf`);
  } catch (error: unknown) {
    handleApiError(error, "Failed to download member profile statement PDF");
    throw error;
  }
};

export const downloadVolunteerDossierPDF = async (
  id: string,
  name?: string,
): Promise<void> => {
  try {
    const response = await api.get(`/admin/volunteers/${id}/dossier-pdf`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const cleanName = name
      ? name.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : "volunteer";
    downloadBlob(blob, `volunteer_dossier_${cleanName}_${Date.now()}.pdf`);
  } catch (error: unknown) {
    handleApiError(
      error,
      "Failed to download volunteer application dossier PDF",
    );
    throw error;
  }
};

export const getUserNetwork = async (
  id: string,
  recursive: boolean,
  page?: number,
  limit?: number,
): Promise<UserNetworkResponse> => {
  try {
    const response = await api.get<UserNetworkResponse>(
      `/admin/users/${id}/network`,
      {
        params: { recursive, page, limit },
      },
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load referred user network");
    throw error;
  }
};

export const getUserNetworkStats = async (
  id: string,
): Promise<UserNetworkStats> => {
  try {
    const response = await api.get<UserNetworkStats>(
      `/admin/users/${id}/network-stats`,
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load network stats");
    throw error;
  }
};

export const updateVolunteerStatus = async (
  id: string,
  status: string,
): Promise<any> => {
  try {
    const response = await api.put<any>(`/admin/volunteers/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to update volunteer status");
    throw error;
  }
};

export const getAdminAnalytics = async (): Promise<AdminAnalyticsResponse> => {
  try {
    const response = await api.get<AdminAnalyticsResponse>("/admin/analytics");
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load operational analytics");
    throw error;
  }
};

export const syncPendingReceipts = async (): Promise<{ count: number }> => {
  try {
    const response = await api.post<{ count: number }>(
      "/admin/payments/sync-receipts",
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to synchronize pending receipts");
    throw error;
  }
};
