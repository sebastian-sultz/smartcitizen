import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { RegisterPayload, LoginPayload, ForgetPasswordPayload, AuthResponse, ForgetPasswordResponse } from "./types";

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    const data = response.data;
    return data;
  } catch (error: any) {
    handleApiError(error, "Login failed");
  }
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    const data = response.data;
    return data;
  } catch (error: any) {
    handleApiError(error, "Registration failed");
  }
};

export const forgetPassword = async (payload: ForgetPasswordPayload): Promise<ForgetPasswordResponse> => {
  try {
    const response = await api.post<ForgetPasswordResponse>('/auth/forget-password', payload);
    const data = response.data;
    return data;
  } catch (error: any) {
    handleApiError(error, "Password reset failed");
  }
};
