import { get, post } from "./client";

export interface CreateReviewInput {
  bookingId: string;
  reviewText: string;
  rating: number;
}

export interface Review {
  id: string;
  user: { id: string; name: string; photo?: string };
  doctor: string;
  booking: string;
  reviewText: string;
  rating: number;
  createdAt: string;
}

export function createReview(input: CreateReviewInput): Promise<Review> {
  return post("/reviews", input);
}

export function listDoctorReviews(doctorId: string): Promise<Review[]> {
  return get(`/doctors/${doctorId}/reviews`);
}
