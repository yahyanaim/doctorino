import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (handler: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
