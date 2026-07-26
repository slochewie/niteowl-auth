import { createKyselyAdapter } from "@btst/adapter-kysely";
import { stack } from "@btst/stack";
import { blogBackendPlugin } from "@btst/stack/plugins/blog/api";
import { cmsBackendPlugin } from "@btst/stack/plugins/cms/api";
import {
  commentsBackendPlugin,
  type CommentsApiContext,
} from "@btst/stack/plugins/comments/api";
import { formBuilderBackendPlugin } from "@btst/stack/plugins/form-builder/api";
import { UI_BUILDER_CONTENT_TYPE } from "@btst/stack/plugins/ui-builder";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const database = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool(),
  }),
});

async function getSessionUser(context: CommentsApiContext) {
  const cookie = context.headers?.get("cookie");
  const response = await fetch(
    `${process.env.AUTH_INTERNAL_URL ?? "http://auth:3000"}/api/auth/get-session`,
    { headers: cookie ? { cookie } : undefined },
  );

  if (!response.ok) return null;
  const session = (await response.json()) as {
    user?: { id?: string; name?: string };
  } | null;
  return session?.user?.id
    ? { id: session.user.id, name: session.user.name }
    : null;
}

async function requireSessionUser(context: CommentsApiContext) {
  const user = await getSessionUser(context);
  if (!user) throw new Error("Authentication required");
  return user;
}

export const { handler, dbSchema } = stack({
  basePath: "/api/data",
  plugins: {
    blog: blogBackendPlugin(),
    cms: cmsBackendPlugin({
      contentTypes: [UI_BUILDER_CONTENT_TYPE],
    }),
    comments: commentsBackendPlugin({
      autoApprove: true,
      onBeforePost: async (_input, context) => ({
        authorId: (await requireSessionUser(context)).id,
      }),
      resolveCurrentUserId: async (context) =>
        (await getSessionUser(context))?.id,
      onBeforeList: async (_query, context) => {
        await requireSessionUser(context);
      },
      onBeforeListByAuthor: async (authorId, _query, context) => {
        const user = await requireSessionUser(context);
        if (user.id !== authorId) throw new Error("Forbidden");
      },
      onBeforeEdit: async (_commentId, _update, context) => {
        await requireSessionUser(context);
      },
      onBeforeLike: async (_commentId, authorId, context) => {
        const user = await requireSessionUser(context);
        if (user.id !== authorId) throw new Error("Forbidden");
      },
      onBeforeStatusChange: async (_commentId, _status, context) => {
        await requireSessionUser(context);
      },
      onBeforeDelete: async (_commentId, context) => {
        await requireSessionUser(context);
      },
    }),
    formBuilder: formBuilderBackendPlugin(),
  },
  adapter: (schema) =>
    createKyselyAdapter(database, schema, {
      type: "postgres",
      transaction: true,
    })({ baseURL: process.env.ADMIN_URL }),
});
