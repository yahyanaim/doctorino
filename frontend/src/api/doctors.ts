import { get, post, patch } from "./client";

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Qualification {
  degree: string;
  university?: string;
  year?: number;
}

export interface Experience {
  position: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
}

export interface Doctor {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photo?: string;
  ticketPrice: number;
  specialization: string;
  qualifications: Qualification[];
  experiences: Experience[];
  bio?: string;
  about?: string;
  timeSlots: TimeSlot[];
  averageRating: number;
  totalReviews: number;
  approvalStatus: string;
}

export interface DoctorListResult {
  items: Doctor[];
  total: number;
}

export interface DoctorListParams {
  search?: string;
  specialization?: string;
  page?: number;
  limit?: number;
}

export function listDoctors(params?: DoctorListParams): Promise<{ items: Doctor[]; meta: { page: number; limit: number; total: number; pages: number } }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.specialization) searchParams.set("specialization", params.specialization);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  return get(`/doctors${qs ? `?${qs}` : ""}`);
}

export function getDoctor(id: string): Promise<Doctor> {
  return get(`/doctors/${id}`);
}
