export interface IBookingRepository {
  create(data: Record<string, unknown>): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  findByUser(userId: string): Promise<unknown>;
  findConflict(doctorId: string, appointmentDate: Date): Promise<unknown>;
  updateById(id: string, data: Record<string, unknown>): Promise<unknown>;
}
