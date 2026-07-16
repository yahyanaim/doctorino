import { Router } from "express";
import { ReviewController } from "../controllers/ReviewController.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createReviewSchema } from "../validation/schemas.js";

export function createReviewRoutes(dependencies: { reviewService: unknown }) {
  const router = Router();
  const controller = new ReviewController(dependencies as unknown as { reviewService: ConstructorParameters<typeof ReviewController>[0]["reviewService"] });

  router.post(
    "/",
    authenticate,
    validate(createReviewSchema),
    asyncHandler(controller.create),
  );

  return router;
}
