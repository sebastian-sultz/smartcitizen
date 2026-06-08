import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import {
  SupportTicket,
  ReportResponse,
  AddMessageResponse,
  ReportMessagesResponse,
} from "./types";

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
