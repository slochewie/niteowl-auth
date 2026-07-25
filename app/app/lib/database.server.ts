import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

const port = Number(process.env.PGPORT ?? "5432");
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error("PGPORT must be a valid TCP port");
}

export const sql = postgres({
  host: required("PGHOST"),
  port,
  database: required("PGDATABASE"),
  username: required("PGUSER"),
  password: required("PGPASSWORD"),
  max: 10,
});

export const db = drizzle(sql);
