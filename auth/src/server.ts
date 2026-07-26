import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth, pool, redis } from "./auth.js";
import { env } from "./env.js";

const app = express();

app.use(cors({ origin: env.trustedOrigins, credentials: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.get("/health", async (_request, response) => {
  await Promise.all([pool.query("SELECT 1"), redis.ping()]);
  response.json({ ok: true, service: "niteowl-auth" });
});

// Email delivery is intentionally not part of this baseline. Keep existing
// accounts consistent with newly created accounts, which are trusted locally.
await pool.query(
  'UPDATE "user" SET "emailVerified" = TRUE WHERE "emailVerified" = FALSE',
);

app.listen(env.port, "0.0.0.0", () => {
  console.log(`NiteOwl Auth listening on port ${env.port}`);
});
