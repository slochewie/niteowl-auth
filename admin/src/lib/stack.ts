import { createKyselyAdapter } from "@btst/adapter-kysely";
import { stack } from "@btst/stack";
import { cmsBackendPlugin } from "@btst/stack/plugins/cms/api";
import { UI_BUILDER_CONTENT_TYPE } from "@btst/stack/plugins/ui-builder";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const database = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool(),
  }),
});

export const { handler, dbSchema } = stack({
  basePath: "/api/data",
  plugins: {
    cms: cmsBackendPlugin({
      contentTypes: [UI_BUILDER_CONTENT_TYPE],
    }),
  },
  adapter: (schema) =>
    createKyselyAdapter(database, schema, {
      type: "postgres",
      transaction: true,
    })({ baseURL: process.env.ADMIN_URL }),
});
