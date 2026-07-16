import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { buildContainer } from "./container.js";
import { createApiRouter } from "./interfaces/http/routes/index.js";
import { correlationId } from "./interfaces/http/middleware/correlationId.js";
import {
  errorHandler,
  notFoundHandler,
} from "./interfaces/http/middleware/errorHandler.js";

export function createApp() {
  const app = express();
  const dependencies = buildContainer();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(correlationId);
  app.use(
    cors({
      origin: env.clientOrigin === "*" ? true : env.clientOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );

  app.use("/api/v1", createApiRouter(dependencies));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
