import { Request, Response } from "express";
import { getValidatedBody } from "../../../shared/utils/requestContext.js";
import { normalizePagination } from "../../../shared/utils/pagination.js";

interface DoctorControllerDeps {
  doctorService: {
    createDoctor(input: Record<string, unknown>): Promise<unknown>;
    getDoctor(id: string): Promise<unknown>;
    listDoctors(params: { search?: string; specialization?: string; skip: number; limit: number }): Promise<{ items: unknown[]; total: number }>;
    updateApproval(id: string, approvalStatus: string): Promise<unknown>;
  };
}

export class DoctorController {
  private doctorService: DoctorControllerDeps["doctorService"];

  constructor({ doctorService }: DoctorControllerDeps) {
    this.doctorService = doctorService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const doctor = await this.doctorService.createDoctor(getValidatedBody(req));
    res.status(201).json({ success: true, data: doctor });
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const doctor = await this.doctorService.getDoctor(req.params.id as string);
    res.json({ success: true, data: doctor });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, skip } = normalizePagination(req.query as { page?: string; limit?: string });
    const result = await this.doctorService.listDoctors({
      search: req.query.search as string | undefined,
      specialization: req.query.specialization as string | undefined,
      skip,
      limit,
    });

    res.json({
      success: true,
      data: result.items,
      meta: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  };

  updateApproval = async (req: Request, res: Response): Promise<void> => {
    const body = getValidatedBody<{ approvalStatus: string }>(req);
    const doctor = await this.doctorService.updateApproval(
      req.params.id as string,
      body.approvalStatus,
    );
    res.json({ success: true, data: doctor });
  };
}
