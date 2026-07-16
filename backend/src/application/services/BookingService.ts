import { BOOKING_STATUS, BOOKING_TRANSITIONS, DOCTOR_APPROVAL_STATUS } from "../../domain/constants.js";
import { AppError } from "../../shared/errors/AppError.js";

interface BookingServiceDeps {
  bookingRepository: {
    findById(id: string): Promise<unknown>;
    findConflict(doctorId: string, appointmentDate: Date): Promise<unknown>;
    create(data: Record<string, unknown>): Promise<unknown>;
    findByUser(userId: string): Promise<unknown>;
    updateById(id: string, data: Record<string, unknown>): Promise<unknown>;
  };
  doctorRepository: {
    findById(id: string): Promise<{ approvalStatus: string; ticketPrice: number } | null>;
  };
}

export class BookingService {
  private bookingRepository: BookingServiceDeps["bookingRepository"];
  private doctorRepository: BookingServiceDeps["doctorRepository"];

  constructor({ bookingRepository, doctorRepository }: BookingServiceDeps) {
    this.bookingRepository = bookingRepository;
    this.doctorRepository = doctorRepository;
  }

  async createBooking(userId: string, input: { doctorId: string; appointmentDate: string; notes?: string }): Promise<unknown> {
    const doctor = await this.doctorRepository.findById(input.doctorId);

    if (!doctor || doctor.approvalStatus !== DOCTOR_APPROVAL_STATUS.APPROVED) {
      throw new AppError("Approved doctor not found", 404, "DOCTOR_NOT_FOUND");
    }

    const appointmentDate = new Date(input.appointmentDate);
    if (appointmentDate <= new Date()) {
      throw new AppError("Appointment date must be in the future", 422, "INVALID_DATE");
    }

    const conflict = await this.bookingRepository.findConflict(
      input.doctorId,
      appointmentDate,
    );

    if (conflict) {
      throw new AppError("This appointment slot is unavailable", 409, "SLOT_UNAVAILABLE");
    }

    return this.bookingRepository.create({
      doctor: input.doctorId,
      user: userId,
      ticketPrice: doctor.ticketPrice,
      appointmentDate,
      notes: input.notes,
      isPaid: false,
    });
  }

  async listMyBookings(userId: string): Promise<unknown> {
    return this.bookingRepository.findByUser(userId);
  }

  async updateStatus(bookingId: string, status: string): Promise<unknown> {
    const booking = await this.bookingRepository.findById(bookingId) as { status: string } | null;
    if (!booking) throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");

    const allowed = BOOKING_TRANSITIONS[booking.status];
    if (!allowed || !allowed.includes(status)) {
      throw new AppError(
        `Cannot transition from '${booking.status}' to '${status}'`,
        422,
        "INVALID_STATUS_TRANSITION",
      );
    }

    return this.bookingRepository.updateById(bookingId, { status });
  }
}
