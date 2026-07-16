import { MongooseUserRepository } from "./infrastructure/repositories/MongooseUserRepository.js";
import { MongooseDoctorRepository } from "./infrastructure/repositories/MongooseDoctorRepository.js";
import { MongooseBookingRepository } from "./infrastructure/repositories/MongooseBookingRepository.js";
import { MongooseReviewRepository } from "./infrastructure/repositories/MongooseReviewRepository.js";
import { AuthService } from "./application/services/AuthService.js";
import { DoctorService } from "./application/services/DoctorService.js";
import { BookingService } from "./application/services/BookingService.js";
import { ReviewService } from "./application/services/ReviewService.js";

export function buildContainer() {
  const userRepository = new MongooseUserRepository();
  const doctorRepository = new MongooseDoctorRepository();
  const bookingRepository = new MongooseBookingRepository();
  const reviewRepository = new MongooseReviewRepository();

  const authService = new AuthService({ userRepository, doctorRepository });
  const doctorService = new DoctorService({ doctorRepository });
  const bookingService = new BookingService({
    bookingRepository,
    doctorRepository,
  });
  const reviewService = new ReviewService({
    reviewRepository,
    bookingRepository,
    doctorRepository,
  });

  return {
    authService,
    doctorService,
    bookingService,
    reviewService,
  };
}
