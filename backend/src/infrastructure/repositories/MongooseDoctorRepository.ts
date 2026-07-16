import { IDoctorRepository } from "../../domain/repositories/IDoctorRepository.js";
import { DoctorModel, IDoctorDocument } from "../database/mongoose/models/DoctorModel.js";

interface FindManyOptions {
  skip?: number;
  limit?: number;
  sort?: string;
}

export class MongooseDoctorRepository implements IDoctorRepository {
  async create(data: Record<string, unknown>): Promise<IDoctorDocument> {
    return DoctorModel.create(data);
  }

  async findByEmail(email: string, { includePassword = false }: { includePassword?: boolean } = {}): Promise<IDoctorDocument | null> {
    let query = DoctorModel.findOne({ email: email.toLowerCase() });
    if (includePassword) query = query.select("+password");
    return query.exec();
  }

  async findById(id: string): Promise<IDoctorDocument | null> {
    return DoctorModel.findById(id).exec();
  }

  async findMany(filter: Record<string, unknown>, { skip = 0, limit = 10, sort = "-averageRating" }: FindManyOptions = {}): Promise<{ items: IDoctorDocument[]; total: number }> {
    const [items, total] = await Promise.all([
      DoctorModel.find(filter).skip(skip).limit(limit).sort(sort).exec(),
      DoctorModel.countDocuments(filter),
    ]);
    return { items, total };
  }

  async updateById(id: string, data: Record<string, unknown>): Promise<IDoctorDocument | null> {
    return DoctorModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async updateRating(id: string, averageRating: number, totalReviews: number): Promise<IDoctorDocument | null> {
    return DoctorModel.findByIdAndUpdate(
      id,
      { averageRating, totalReviews },
      { new: true, runValidators: true },
    ).exec();
  }
}
