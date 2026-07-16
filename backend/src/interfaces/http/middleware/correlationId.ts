import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const id = req.headers["x-correlation-id"] as string ?? crypto.randomUUID();
  req.correlationId = id;
  res.setHeader("x-correlation-id", id);
  next();
}

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}
