import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js";
import { AppError } from "../../../shared/errors/AppError.js";

export interface AuthPayload {
  sub: string;
  role?: string;
  type?: string;
  approvalStatus?: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      validated?: Record<string, unknown>;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return next(new AppError("Authentication required", 401, "UNAUTHENTICATED"));
  }

  try {
    req.auth = jwt.verify(token, env.jwtSecret) as AuthPayload;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401, "INVALID_TOKEN"));
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role as string)) {
      return next(new AppError("Insufficient permissions", 403, "FORBIDDEN"));
    }
    next();
  };
}
