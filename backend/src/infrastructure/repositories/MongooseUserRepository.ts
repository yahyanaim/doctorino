import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { UserModel, IUserDocument } from "../database/mongoose/models/UserModel.js";

export class MongooseUserRepository implements IUserRepository {
  async create(data: Record<string, unknown>): Promise<IUserDocument> {
    return UserModel.create(data);
  }

  async findByEmail(email: string, { includePassword = false }: { includePassword?: boolean } = {}): Promise<IUserDocument | null> {
    let query = UserModel.findOne({ email: email.toLowerCase() });
    if (includePassword) query = query.select("+password");
    return query.exec();
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).exec();
  }
}
