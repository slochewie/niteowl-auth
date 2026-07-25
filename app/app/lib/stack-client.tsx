import {
  accountClientPlugin,
  authClientPlugin,
  organizationClientPlugin,
} from "@btst/better-auth-ui/client";
import { createStackClient } from "@btst/stack/client";
import type { QueryClient } from "@tanstack/react-query";

function getBaseURL() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getStackClient(_queryClient: QueryClient) {
  const baseURL = getBaseURL();

  return createStackClient({
    plugins: {
      auth: authClientPlugin({ siteBaseURL: baseURL, siteBasePath: "/p" }),
      account: accountClientPlugin({ siteBaseURL: baseURL, siteBasePath: "/p" }),
      organization: organizationClientPlugin({ siteBaseURL: baseURL, siteBasePath: "/p" }),
    },
  });
}
