import { BOOKING_STATUS } from "../../domain/constants.js";
import { AppError } from "../../shared/errors/AppError.js";

interface ReviewServiceDeps {
  reviewRepository: {
    findByDoctorAndUser(doctorId: string, userId: string): Promise<unknown>;
    create(data: Record<string, unknown>): Promise<unknown>;
    getDoctorRatingSummary(doctorId: string): Promise<{ averageRating: number; totalReviews: number }>;
    findByDoctor(doctorId: string): Promise<unknown>;
  };
  bookingRepository: {
    findById(id: string): Promise<{ doctor: { toString(): string }; user: { toString(): string }; status: string; id?: string } | null>;
  };
  doctorRepository: {
    updateRating(id: string, averageRating: number, totalReviews: number): Promise<unknown>;
  };
}

export class ReviewService {
  private reviewRepository: ReviewServiceDeps["reviewRepository"];
  private bookingRepository: ReviewServiceDeps["bookingRepository"];
  private doctorRepository: ReviewServiceDeps["doctorRepository"];

  constructor({ reviewRepository, bookingRepository, doctorRepository }: ReviewServiceDeps) {
    this.reviewRepository = reviewRepository;
    this.bookingRepository = bookingRepository;
    this.doctorRepository = doctorRepository;
  }

  async createReview(userId: string, input: { bookingId: string; reviewText: string; rating: number }): Promise<unknown> {
    const booking = await this.bookingRepository.findById(input.bookingId);

    if (!booking || booking.user.toString() !== String(userId)) {
      throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    if (booking.status !== BOOKING_STATUS.COMPLETED) {
      throw new AppError(
        "A review can only be submitted after a completed appointment",
        422,
        "BOOKING_NOT_COMPLETED",
      );
    }

    const existing = await this.reviewRepository.findByDoctorAndUser(
      booking.doctor.toString(),
      userId,
    );

    if (existing) {
      throw new AppError("You already reviewed this doctor", 409, "REVIEW_EXISTS");
    }

    let review: unknown;
    try {
      review = await this.reviewRepository.create({
        doctor: booking.doctor.toString(),
        user: userId,
        booking: booking.id,
        reviewText: input.reviewText,
        rating: input.rating,
      });
    } catch (error: unknown) {
      if ((error as { code?: number })?.code === 11000) {
        throw new AppError("You already reviewed this doctor", 409, "REVIEW_EXISTS");
      }
      throw error;
    }

    const summary = await this.reviewRepository.getDoctorRatingSummary(booking.doctor.toString());
    await this.doctorRepository.updateRating(
      booking.doctor.toString(),
      Number(summary.averageRating.toFixed(2)),
      summary.totalReviews,
    );

    return review;
  }

  async listDoctorReviews(doctorId: string): Promise<unknown> {
    return this.reviewRepository.findByDoctor(doctorId);
  }
}
