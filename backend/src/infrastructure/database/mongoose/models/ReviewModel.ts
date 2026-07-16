import mongoose, { Document, Model } from "mongoose";

export interface IReviewDocument extends Document {
  doctor: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  reviewText: string;
  rating: number;
}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 2000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true, versionKey: false },
);

reviewSchema.index({ doctor: 1, user: 1 }, { unique: true });
reviewSchema.index({ doctor: 1, createdAt: -1 });

export const ReviewModel: Model<IReviewDocument> =
  mongoose.models.Review ?? mongoose.model<IReviewDocument>("Review", reviewSchema);
