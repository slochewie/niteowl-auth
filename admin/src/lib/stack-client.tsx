import {
  accountClientPlugin,
  authClientPlugin,
  organizationClientPlugin,
} from "@btst/better-auth-ui/client";
import { createStackClient } from "@btst/stack/client";
import { blogClientPlugin } from "@btst/stack/plugins/blog/client";
import { cmsClientPlugin } from "@btst/stack/plugins/cms/client";
import { commentsClientPlugin } from "@btst/stack/plugins/comments/client";
import { formBuilderClientPlugin } from "@btst/stack/plugins/form-builder/client";
import {
  defaultComponentRegistry,
  uiBuilderClientPlugin,
} from "@btst/stack/plugins/ui-builder/client";
import type { QueryClient } from "@tanstack/react-query";

export function getStackClient(queryClient: QueryClient) {
  const siteBaseURL =
    typeof window === "undefined"
      ? process.env.ADMIN_URL ?? "http://localhost:3030"
      : window.location.origin;

  return createStackClient({
    plugins: {
      auth: authClientPlugin({ siteBaseURL, siteBasePath: "/p" }),
      account: accountClientPlugin({ siteBaseURL, siteBasePath: "/p" }),
      organization: organizationClientPlugin({ siteBaseURL, siteBasePath: "/p" }),
      cms: cmsClientPlugin({
        apiBaseURL: siteBaseURL,
        apiBasePath: "/api/data",
        siteBaseURL,
        siteBasePath: "/p",
        queryClient,
      }),
      blog: blogClientPlugin({
        apiBaseURL: siteBaseURL,
        apiBasePath: "/api/data",
        siteBaseURL,
        siteBasePath: "/p",
        queryClient,
      }),
      comments: commentsClientPlugin({
        apiBaseURL: siteBaseURL,
        apiBasePath: "/api/data",
        siteBaseURL,
        siteBasePath: "/p",
        queryClient,
      }),
      formBuilder: formBuilderClientPlugin({
        apiBaseURL: siteBaseURL,
        apiBasePath: "/api/data",
        siteBaseURL,
        siteBasePath: "/p",
        queryClient,
      }),
      uiBuilder: uiBuilderClientPlugin({
        apiBaseURL: siteBaseURL,
        apiBasePath: "/api/data",
        siteBaseURL,
        siteBasePath: "/p",
        queryClient,
        componentRegistry: defaultComponentRegistry,
      }),
    },
  });
}
