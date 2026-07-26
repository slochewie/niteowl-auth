import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth, pool } from "./auth.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const corsOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, service: "niteowl-auth" });
  } catch (error) {
    console.error("Health check failed", error);
    res.status(503).json({ ok: false, service: "niteowl-auth" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`NiteOwl Auth API listening on port ${port}`);
});
