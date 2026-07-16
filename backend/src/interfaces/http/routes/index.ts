import { Router, Request, Response } from "express";
import { createAuthRoutes } from "./auth.routes.js";
import { createDoctorRoutes } from "./doctor.routes.js";
import { createBookingRoutes } from "./booking.routes.js";
import { createReviewRoutes } from "./review.routes.js";

interface AppDependencies {
  authService: unknown;
  doctorService: unknown;
  bookingService: unknown;
  reviewService: unknown;
}

export function createApiRouter(dependencies: AppDependencies) {
  const router = Router();

  router.get("/health", (_req: Request, res: Response) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  router.use("/auth", createAuthRoutes(dependencies as unknown as Record<string, unknown>));
  router.use("/doctors", createDoctorRoutes(dependencies));
  router.use("/bookings", createBookingRoutes(dependencies));
  router.use("/reviews", createReviewRoutes(dependencies));

  return router;
}
