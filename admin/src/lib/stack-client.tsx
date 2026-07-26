import {
  accountClientPlugin,
  authClientPlugin,
  organizationClientPlugin,
} from "@btst/better-auth-ui/client";
import { createStackClient } from "@btst/stack/client";

export function getStackClient() {
  const siteBaseURL =
    typeof window === "undefined"
      ? process.env.ADMIN_URL ?? "http://localhost:3030"
      : window.location.origin;

  return createStackClient({
    plugins: {
      auth: authClientPlugin({ siteBaseURL, siteBasePath: "/p" }),
      account: accountClientPlugin({ siteBaseURL, siteBasePath: "/p" }),
      organization: organizationClientPlugin({ siteBaseURL, siteBasePath: "/p" }),
    },
  });
}
