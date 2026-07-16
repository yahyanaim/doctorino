export interface IUserRepository {
  create(data: Record<string, unknown>): Promise<unknown>;
  findByEmail(email: string, options?: { includePassword?: boolean }): Promise<unknown>;
  findById(id: string): Promise<unknown>;
}
