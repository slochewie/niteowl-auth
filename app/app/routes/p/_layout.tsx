import { StackProvider } from "@btst/stack/context";
import { reactRouter } from "@btst/stack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { authClient } from "~/lib/auth-client";
import { getOrCreateQueryClient } from "~/lib/query-client";

function getBaseURL() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export default function BtstPagesLayout() {
  const queryClient = getOrCreateQueryClient();
  const baseURL = getBaseURL();

  return (
    <QueryClientProvider client={queryClient}>
      <StackProvider
        basePath="/p"
        router={reactRouter()}
        api={{ baseURL, basePath: "/api/data" }}
        overrides={{
          auth: {
            authClient,
            basePath: "/p/auth",
            redirectTo: "/p/account/settings",
          },
          account: {
            authClient,
            basePath: "/p/account",
            account: { fields: ["image", "name"] },
          },
          organization: {
            authClient,
            basePath: "/p/org",
            organization: { basePath: "/p/org" },
          },
        }}
      >
        <Outlet />
      </StackProvider>
    </QueryClientProvider>
  );
}
