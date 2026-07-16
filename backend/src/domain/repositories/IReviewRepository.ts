export interface IReviewRepository {
  create(data: Record<string, unknown>): Promise<unknown>;
  findByDoctor(doctorId: string): Promise<unknown>;
  findByDoctorAndUser(doctorId: string, userId: string): Promise<unknown>;
  getDoctorRatingSummary(doctorId: string): Promise<unknown>;
}
