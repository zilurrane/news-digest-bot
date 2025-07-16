// src/app.ts
import "dotenv/config";
import "./scheduler";
import { runDigestJob } from "./scheduler";

console.log("X Digest Bot is up and running...");

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    runDigestJob();
  }
};
