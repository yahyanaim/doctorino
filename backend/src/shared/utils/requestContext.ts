import { Request } from "express";
import { AppError } from "../errors/AppError.js";

export function getAuth(req: Request) {
  if (!req.auth) {
    throw new AppError("Authentication required", 401, "UNAUTHENTICATED");
  }
  return req.auth;
}

export function getValidated(req: Request) {
  if (!req.validated) {
    throw new AppError("No validated data available", 500, "MISSING_VALIDATED");
  }
  return req.validated;
}

export function getValidatedBody<T = Record<string, unknown>>(req: Request): T {
  return (getValidated(req).body ?? getValidated(req)) as T;
}
