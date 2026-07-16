import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../../../shared/errors/AppError.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, "ROUTE_NOT_FOUND"));
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
  let appError: AppError;

  if (error instanceof mongoose.Error.CastError) {
    appError = new AppError("Invalid resource identifier", 400, "INVALID_ID");
  } else if ((error as { code?: number }).code === 11000) {
    appError = new AppError(
      "A resource with the same unique value already exists",
      409,
      "DUPLICATE_RESOURCE",
      (error as { keyValue?: Record<string, unknown> }).keyValue,
    );
  } else if (error instanceof AppError) {
    appError = error;
  } else {
    appError = new AppError("Internal server error", 500, "INTERNAL_ERROR");
  }

  const statusCode = appError.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    error: {
      code: appError.code ?? "INTERNAL_ERROR",
      message: statusCode === 500 ? "Internal server error" : appError.message,
      details: appError.details,
    },
  });
}
