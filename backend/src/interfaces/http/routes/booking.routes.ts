import { Router } from "express";
import { BookingController } from "../controllers/BookingController.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { bookingStatusSchema, createBookingSchema } from "../validation/schemas.js";
import { USER_ROLES } from "../../../domain/constants.js";

export function createBookingRoutes(dependencies: { bookingService: unknown }) {
  const router = Router();
  const controller = new BookingController(dependencies as unknown as { bookingService: ConstructorParameters<typeof BookingController>[0]["bookingService"] });

  router.use(authenticate);

  router.post("/", validate(createBookingSchema), asyncHandler(controller.create));
  router.get("/me", asyncHandler(controller.listMine));
  router.patch(
    "/:id/status",
    authorize(USER_ROLES.ADMIN),
    validate(bookingStatusSchema),
    asyncHandler(controller.updateStatus),
  );

  return router;
}
