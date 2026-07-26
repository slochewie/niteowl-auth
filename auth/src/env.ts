const requiredNames = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "PGHOST",
  "PGPORT",
  "PGDATABASE",
  "PGUSER",
  "PGPASSWORD",
  "REDIS_URL",
] as const;

for (const name of requiredNames) {
  if (!process.env[name]) throw new Error(`${name} is required`);
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  redisURL: process.env.REDIS_URL!,
};
