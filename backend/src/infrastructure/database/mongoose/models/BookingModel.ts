import mongoose, { Document, Model } from "mongoose";
import { BOOKING_STATUS } from "../../../../domain/constants.js";

export interface IBookingDocument extends Document {
  doctor: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  ticketPrice: number;
  appointmentDate: Date;
  status: string;
  isPaid: boolean;
  paymentReference?: string;
  notes?: string;
}

const bookingSchema = new mongoose.Schema<IBookingDocument>(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
      index: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentReference: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true, versionKey: false },
);

bookingSchema.index(
  { doctor: 1, appointmentDate: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED] },
    },
  },
);

export const BookingModel: Model<IBookingDocument> =
  mongoose.models.Booking ?? mongoose.model<IBookingDocument>("Booking", bookingSchema);
