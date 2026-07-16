export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: Record<string, unknown> | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    details: Record<string, unknown> | undefined = undefined,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }
}
