export interface IDoctorRepository {
  create(data: Record<string, unknown>): Promise<unknown>;
  findByEmail(email: string, options?: { includePassword?: boolean }): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  findMany(filter: Record<string, unknown>, options?: Record<string, unknown>): Promise<unknown>;
  updateById(id: string, data: Record<string, unknown>): Promise<unknown>;
  updateRating(id: string, averageRating: number, totalReviews: number): Promise<unknown>;
}
