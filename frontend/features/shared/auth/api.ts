import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { RegisterPayload, LoginPayload, ForgetPasswordPayload, AuthResponse, ForgetPasswordResponse, UserResponse, SystemStatsResponse } from "./types";

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    const data = response.data;
    return data;
  } catch (error: unknown) {
    handleApiError(error, "Login failed");
  }
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    const data = response.data;
    return data;
  } catch (error: unknown) {
    handleApiError(error, "Registration failed");
  }
};

export const forgetPassword = async (payload: ForgetPasswordPayload): Promise<ForgetPasswordResponse> => {
  try {
    const response = await api.post<ForgetPasswordResponse>('/auth/forget-password', payload);
    const data = response.data;
    return data;
  } catch (error: unknown) {
    handleApiError(error, "Password reset failed");
  }
};

export const getProfile = async (): Promise<UserResponse> => {
  try {
    const response = await api.get<{ user: UserResponse }>('/auth/me');
    return response.data.user;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load user profile");
    throw error;
  }
};

export const updateProfilePhoto = async (id: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("profile_photo", file);
    const response = await api.put<{ url: string }>(`/auth/profile-photo/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.url;
  } catch (error: unknown) {
    handleApiError(error, "Failed to upload profile photo");
    throw error;
  }
};

export const getSystemStats = async (): Promise<SystemStatsResponse> => {
  try {
    const response = await api.get<SystemStatsResponse>("/auth/stats");
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load system statistics");
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (error: unknown) {
    console.error("Logout request failed:", error);
    throw error;
  }
};
