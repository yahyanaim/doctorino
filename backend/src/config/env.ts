import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

interface Env {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientOrigin: string;
}

export const env: Readonly<Env> = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "*",
});
