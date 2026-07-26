import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { Redis } from "ioredis";
import { Pool } from "pg";
import { env } from "./env.js";

export const pool = new Pool();
export const redis = new Redis({
  ...env.redis,
  maxRetriesPerRequest: 3,
});

export const auth = betterAuth({
  appName: "NiteOwl Auth",
  baseURL: env.baseURL,
  secret: env.secret,
  trustedOrigins: env.trustedOrigins,
  database: pool,
  secondaryStorage: redisStorage({ client: redis }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, emailVerified: true },
        }),
      },
    },
  },
  plugins: [
    admin({ defaultRole: "user", adminRoles: ["admin"] }),
    organization({
      allowUserToCreateOrganization: true,
      requireEmailVerificationOnInvitation: false,
    }),
  ],
});
