import { get, post } from "./client";

export interface CreateBookingInput {
  doctorId: string;
  appointmentDate: string;
  notes?: string;
}

export interface Booking {
  id: string;
  doctor: { id: string; name: string; specialization: string; photo?: string };
  user: string;
  ticketPrice: number;
  appointmentDate: string;
  status: string;
  isPaid: boolean;
  notes?: string;
}

export function createBooking(input: CreateBookingInput): Promise<Booking> {
  return post("/bookings", input);
}

export function listMyBookings(): Promise<Booking[]> {
  return get("/bookings/me");
}
