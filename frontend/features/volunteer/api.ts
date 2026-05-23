import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { VolunteerResponse, CreateVolunteerPayload, UpdateVolunteerPayload } from "./types";

export const createVolunteer = async (payload: CreateVolunteerPayload): Promise<VolunteerResponse> => {
  try {
    const response = await api.post<{ volunteer: VolunteerResponse }>('/volunteers', payload);
    return response.data.volunteer;
  } catch (error: any) {
    handleApiError(error, "Failed to submit volunteer application");
    throw error;
  }
};

export const getVolunteerById = async (id: string): Promise<VolunteerResponse> => {
  try {
    const response = await api.get<{ volunteer: VolunteerResponse }>(`/volunteers/${id}`);
    return response.data.volunteer;
  } catch (error: any) {
    handleApiError(error, "Failed to get volunteer details");
    throw error;
  }
};

export const getAllVolunteers = async (search?: string): Promise<{ volunteers: VolunteerResponse[] }> => {
  try {
    const params = search ? { q: search } : {};
    const response = await api.get<{ volunteers: VolunteerResponse[] }>('/volunteers', { params });
    return response.data;
  } catch (error: any) {
    handleApiError(error, "Failed to load volunteers list");
    throw error;
  }
};

export const updateVolunteer = async (id: string, payload: UpdateVolunteerPayload): Promise<VolunteerResponse> => {
  try {
    const response = await api.put<{ volunteer: VolunteerResponse }>(`/volunteers/${id}`, payload);
    return response.data.volunteer;
  } catch (error: any) {
    handleApiError(error, "Failed to update volunteer details");
    throw error;
  }
};

export const deleteVolunteer = async (id: string): Promise<void> => {
  try {
    await api.delete(`/volunteers/${id}`);
  } catch (error: any) {
    handleApiError(error, "Failed to delete volunteer profile");
    throw error;
  }
};

export const updateVolunteerImage = async (id: string, imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("profilephoto", imageFile);
    const response = await api.put<{ url: string }>(`/volunteers/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.url;
  } catch (error: any) {
    handleApiError(error, "Failed to upload volunteer profile photo");
    throw error;
  }
};
