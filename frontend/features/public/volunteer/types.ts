export interface VolunteerResponse {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  address?: string;
  city?: string;
  district?: string;
  pincode?: string;
  profession?: string;
  experience?: string;
  ispublicconsent: boolean;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVolunteerPayload {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  address?: string;
  city?: string;
  district?: string;
  pincode?: string;
  profession?: string;
  experience?: string;
  ispublicconsent?: boolean;
}

export interface UpdateVolunteerPayload {
  name?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  address?: string;
  city?: string;
  district?: string;
  pincode?: string;
  profession?: string;
  experience?: string;
  ispublicconsent?: boolean;
}
