import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`Medicare API listening on port ${env.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received. Shutting down.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((error: Error) => {
  console.error("Failed to start application", error);
  process.exit(1);
});
