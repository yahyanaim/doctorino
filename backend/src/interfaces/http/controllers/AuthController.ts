import { Request, Response } from "express";
import { getValidatedBody } from "../../../shared/utils/requestContext.js";

interface AuthControllerDeps {
  authService: {
    register(input: Record<string, unknown>): Promise<{ user: unknown; token: string }>;
    login(input: Record<string, unknown>): Promise<{ user: unknown; token: string }>;
    loginDoctor(input: Record<string, unknown>): Promise<{ doctor: unknown; token: string }>;
  };
}

export class AuthController {
  private authService: AuthControllerDeps["authService"];

  constructor({ authService }: AuthControllerDeps) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(getValidatedBody(req));
    res.status(201).json({ success: true, data: result });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(getValidatedBody(req));
    res.json({ success: true, data: result });
  };

  loginDoctor = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.loginDoctor(getValidatedBody(req));
    res.json({ success: true, data: result });
  };
}
