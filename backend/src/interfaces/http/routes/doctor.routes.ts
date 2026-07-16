import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController.js";
import { ReviewController } from "../controllers/ReviewController.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { approvalSchema, createDoctorSchema } from "../validation/schemas.js";
import { USER_ROLES } from "../../../domain/constants.js";

export function createDoctorRoutes(dependencies: { doctorService: unknown; reviewService: unknown }) {
  const router = Router();
  const controller = new DoctorController(dependencies as unknown as { doctorService: ConstructorParameters<typeof DoctorController>[0]["doctorService"] });
  const reviewController = new ReviewController(dependencies as unknown as { reviewService: ConstructorParameters<typeof ReviewController>[0]["reviewService"] });

  router.get("/", asyncHandler(controller.list));
  router.get("/:doctorId/reviews", asyncHandler(reviewController.listByDoctor));
  router.get("/:id", asyncHandler(controller.getOne));

  router.post(
    "/",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validate(createDoctorSchema),
    asyncHandler(controller.create),
  );

  router.patch(
    "/:id/approval",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validate(approvalSchema),
    asyncHandler(controller.updateApproval),
  );

  return router;
}
