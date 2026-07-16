import { IBookingRepository } from "../../domain/repositories/IBookingRepository.js";
import { BOOKING_STATUS } from "../../domain/constants.js";
import { BookingModel, IBookingDocument } from "../database/mongoose/models/BookingModel.js";

export class MongooseBookingRepository implements IBookingRepository {
  async create(data: Record<string, unknown>): Promise<IBookingDocument> {
    return BookingModel.create(data);
  }

  async findById(id: string): Promise<IBookingDocument | null> {
    return BookingModel.findById(id).exec();
  }

  async findByUser(userId: string): Promise<IBookingDocument[]> {
    return BookingModel.find({ user: userId })
      .populate("doctor", "name specialization photo")
      .sort("-appointmentDate")
      .exec();
  }

  async findConflict(doctorId: string, appointmentDate: Date): Promise<IBookingDocument | null> {
    return BookingModel.findOne({
      doctor: doctorId,
      appointmentDate,
      status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED] },
    }).exec();
  }

  async updateById(id: string, data: Record<string, unknown>): Promise<IBookingDocument | null> {
    return BookingModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }
}
