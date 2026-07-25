import { createDrizzleAdapter } from "@btst/adapter-drizzle";
import { stack } from "@btst/stack";
import { db } from "./database.server";

const configured = stack({
  basePath: "/api/data",
  plugins: {},
  adapter: (schema) =>
    createDrizzleAdapter(db, schema, { provider: "pg" })({}),
});

export const handler = configured.handler;
export const dbSchema = configured.dbSchema;
