import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL,
  fetchOptions: { credentials: "include" },
  plugins: [adminClient(), organizationClient()],
});
