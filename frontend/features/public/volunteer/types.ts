export interface VolunteerResponse {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  address: string;
  city: string;
  district: string;
  pincode: string;
  state?: string;
  profession: string;
  experience: string;
  specialties?: string[];
  ispublicconsent: boolean;
  status: string;
  image: string | null;
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
  state?: string;
  pincode?: string;
  profession?: string;
  experience?: string;
  specialties?: string[];
  ispublicconsent?: boolean;
  password?: string;
}

export interface UpdateVolunteerPayload {
  name?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  profession?: string;
  experience?: string;
  specialties?: string[];
  ispublicconsent?: boolean;
}
