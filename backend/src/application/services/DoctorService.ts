import { DOCTOR_APPROVAL_STATUS } from "../../domain/constants.js";
import { AppError } from "../../shared/errors/AppError.js";

interface DoctorServiceDeps {
  doctorRepository: {
    create(data: Record<string, unknown>): Promise<unknown>;
    findById(id: string): Promise<unknown>;
    findMany(filter: Record<string, unknown>, options: { skip: number; limit: number }): Promise<{ items: unknown[]; total: number }>;
    updateById(id: string, data: Record<string, unknown>): Promise<unknown>;
  };
}

export class DoctorService {
  private doctorRepository: DoctorServiceDeps["doctorRepository"];

  constructor({ doctorRepository }: DoctorServiceDeps) {
    this.doctorRepository = doctorRepository;
  }

  async createDoctor(input: Record<string, unknown>): Promise<unknown> {
    return this.doctorRepository.create(input);
  }

  async getDoctor(id: string): Promise<unknown> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    return doctor;
  }

  async listDoctors({ search, specialization, skip, limit }: { search?: string; specialization?: string; skip: number; limit: number }): Promise<{ items: unknown[]; total: number }> {
    const filter: Record<string, unknown> = { approvalStatus: DOCTOR_APPROVAL_STATUS.APPROVED };

    if (specialization) filter.specialization = specialization;
    if (search) filter.$text = { $search: search };

    return this.doctorRepository.findMany(filter, { skip, limit });
  }

  async updateApproval(id: string, approvalStatus: string): Promise<unknown> {
    const doctor = await this.doctorRepository.updateById(id, { approvalStatus });
    if (!doctor) throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    return doctor;
  }
}
