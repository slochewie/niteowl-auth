import { createKyselyAdapter } from "@btst/adapter-kysely";
import { stack } from "@btst/stack";
import { blogBackendPlugin } from "@btst/stack/plugins/blog/api";
import { cmsBackendPlugin } from "@btst/stack/plugins/cms/api";
import { commentsBackendPlugin } from "@btst/stack/plugins/comments/api";
import { formBuilderBackendPlugin } from "@btst/stack/plugins/form-builder/api";
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
    blog: blogBackendPlugin(),
    cms: cmsBackendPlugin({
      contentTypes: [UI_BUILDER_CONTENT_TYPE],
    }),
    comments: commentsBackendPlugin(),
    formBuilder: formBuilderBackendPlugin(),
  },
  adapter: (schema) =>
    createKyselyAdapter(database, schema, {
      type: "postgres",
      transaction: true,
    })({ baseURL: process.env.ADMIN_URL }),
});
