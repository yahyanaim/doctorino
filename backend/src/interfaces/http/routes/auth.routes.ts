import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validation/schemas.js";

export function createAuthRoutes(dependencies: Record<string, unknown>) {
  const router = Router();
  const controller = new AuthController(dependencies as unknown as { authService: ConstructorParameters<typeof AuthController>[0]["authService"] });

  router.post("/register", validate(registerSchema), asyncHandler(controller.register));
  router.post("/login", validate(loginSchema), asyncHandler(controller.login));
  router.post("/doctor/login", validate(loginSchema), asyncHandler(controller.loginDoctor));

  return router;
}
