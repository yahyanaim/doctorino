import { Request, Response } from "express";
import { getAuth, getValidatedBody } from "../../../shared/utils/requestContext.js";

interface ReviewControllerDeps {
  reviewService: {
    createReview(userId: string, input: Record<string, unknown>): Promise<unknown>;
    listDoctorReviews(doctorId: string): Promise<unknown>;
  };
}

export class ReviewController {
  private reviewService: ReviewControllerDeps["reviewService"];

  constructor({ reviewService }: ReviewControllerDeps) {
    this.reviewService = reviewService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const auth = getAuth(req);
    const review = await this.reviewService.createReview(
      auth.sub,
      getValidatedBody(req),
    );
    res.status(201).json({ success: true, data: review });
  };

  listByDoctor = async (req: Request, res: Response): Promise<void> => {
    const reviews = await this.reviewService.listDoctorReviews(req.params.doctorId as string);
    res.json({ success: true, data: reviews });
  };
}
