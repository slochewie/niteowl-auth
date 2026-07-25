import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { Pool } from "pg";

const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const pool = new Pool();

export const auth = betterAuth({
  appName: "NiteOwl Auth",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: pool,
  emailAndPassword: { enabled: true },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const result = await pool.query<{ count: string }>(
            'SELECT COUNT(*)::text AS count FROM "user"',
          );
          const isFirstUser = result.rows[0]?.count === "0";

          return {
            data: {
              ...user,
              role: isFirstUser ? "admin" : "user",
            },
          };
        },
      },
    },
  },
  plugins: [
    admin({ defaultRole: "user", adminRoles: ["admin"] }),
    organization({ allowUserToCreateOrganization: true }),
  ],
});
