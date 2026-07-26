import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined" ? process.env.ADMIN_URL : window.location.origin,
  fetchOptions: { credentials: "include" },
  plugins: [adminClient(), organizationClient()],
});
