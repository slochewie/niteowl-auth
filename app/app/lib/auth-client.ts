import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: typeof window === "undefined" ? process.env.PUBLIC_SITE_URL : window.location.origin,
  plugins: [organizationClient()],
});
