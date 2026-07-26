import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { VolunteerResponse, CreateVolunteerPayload, UpdateVolunteerPayload } from "./types";

export const createVolunteer = async (payload: CreateVolunteerPayload): Promise<VolunteerResponse> => {
  try {
    const response = await api.post<{ volunteer: VolunteerResponse }>('/volunteers', payload);
    return response.data.volunteer;
  } catch (error: unknown) {
    handleApiError(error, "Failed to submit volunteer application");
    throw error;
  }
};

export const getVolunteerById = async (id: string): Promise<VolunteerResponse> => {
  try {
    const response = await api.get<{ volunteer: VolunteerResponse }>(`/volunteers/${id}`);
    return response.data.volunteer;
  } catch (error: unknown) {
    handleApiError(error, "Failed to get volunteer details");
    throw error;
  }
};

import { PaginationInfo } from "@/features/admin/api";

export interface VolunteerQueryParams {
  search?: string;
  profession?: string;
  state?: string;
  city?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface GetVolunteersResponse {
  volunteers: VolunteerResponse[];
  pagination?: PaginationInfo;
}

export const getAllVolunteers = async (
  queryParams?: VolunteerQueryParams
): Promise<GetVolunteersResponse> => {
  try {
    const params: Record<string, string | number> = {};

    if (queryParams?.search) params.q = queryParams.search;
    if (queryParams?.profession && queryParams.profession !== "All") params.profession = queryParams.profession;
    if (queryParams?.state && queryParams.state !== "All") params.state = queryParams.state;
    if (queryParams?.city && queryParams.city !== "All") params.city = queryParams.city;
    if (queryParams?.sort) params.sort = queryParams.sort;
    if (queryParams?.page) params.page = queryParams.page;
    if (queryParams?.limit) params.limit = queryParams.limit;
    
    const response = await api.get<GetVolunteersResponse>('/volunteers', { params });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load volunteers list");
    throw error;
  }
};

export const updateVolunteer = async (id: string, payload: UpdateVolunteerPayload): Promise<VolunteerResponse> => {
  try {
    const response = await api.put<{ volunteer: VolunteerResponse }>(`/volunteers/${id}`, payload);
    return response.data.volunteer;
  } catch (error: unknown) {
    handleApiError(error, "Failed to update volunteer details");
    throw error;
  }
};

export const deleteVolunteer = async (id: string): Promise<void> => {
  try {
    await api.delete(`/volunteers/${id}`);
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    handleApiError(error, "Failed to upload volunteer profile photo");
    throw error;
  }
};

export interface PostOffice {
  Name: string;
  Description: string | null;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

export interface PostalApiResponse {
  Message: string;
  Status: "Success" | "Error" | "404";
  PostOffice: PostOffice[] | null;
}

export interface PincodeDetails {
  state: string;
  district: string;
  city: string;
}

export const lookupPincode = async (pincode: string): Promise<PincodeDetails | null> => {
  if (!/^\d{6}$/.test(pincode)) return null;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (!res.ok) return null;

    const data: PostalApiResponse[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const result = data[0];
    if (result.Status !== "Success" || !result.PostOffice || result.PostOffice.length === 0) {
      return null;
    }

    // Prioritize primary delivery post office if available, otherwise take the first entry
    const poList = result.PostOffice;
    const po = poList.find((item) => item.DeliveryStatus === "Delivery") || poList[0];

    const state = po.State ? po.State.trim() : "";
    const district = po.District ? po.District.trim() : "";

    // Determine city/town from Block or Post Office Name
    let city = "";
    if (po.Block && po.Block.trim() !== "NA") {
      city = po.Block.trim();
    } else if (po.Name) {
      city = po.Name.trim();
    }

    return { state, district, city };
  } catch (error: unknown) {
    console.error("India Post Pincode API lookup error:", error);
    return null;
  }
};
