import mongoose from "mongoose";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository.js";
import { ReviewModel, IReviewDocument } from "../database/mongoose/models/ReviewModel.js";

interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  _id?: mongoose.Types.ObjectId;
}

export class MongooseReviewRepository implements IReviewRepository {
  async create(data: Record<string, unknown>): Promise<IReviewDocument> {
    return ReviewModel.create(data);
  }

  async findByDoctor(doctorId: string): Promise<IReviewDocument[]> {
    return ReviewModel.find({ doctor: doctorId })
      .populate("user", "name photo")
      .sort("-createdAt")
      .exec();
  }

  async findByDoctorAndUser(doctorId: string, userId: string): Promise<IReviewDocument | null> {
    return ReviewModel.findOne({ doctor: doctorId, user: userId }).exec();
  }

  async getDoctorRatingSummary(doctorId: string): Promise<{ averageRating: number; totalReviews: number }> {
    const [summary] = await ReviewModel.aggregate<RatingSummary>([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: "$doctor",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return summary ?? { averageRating: 0, totalReviews: 0 };
  }
}
