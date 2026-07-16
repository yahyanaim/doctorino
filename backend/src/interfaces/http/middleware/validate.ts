import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../../../shared/errors/AppError.js";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
        new AppError(
          "Validation failed",
          422,
          "VALIDATION_ERROR",
          result.error.flatten() as unknown as Record<string, unknown>,
        ),
      );
    }

    req.validated = result.data as Record<string, unknown>;
    next();
  };
}
