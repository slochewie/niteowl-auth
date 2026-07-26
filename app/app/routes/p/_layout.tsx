import { StackProvider } from "@btst/stack/context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { authClient } from "~/lib/auth-client";
import { getOrCreateQueryClient } from "~/lib/query-client";

export default function BtstPagesLayout() {
  const queryClient = getOrCreateQueryClient();

  const sharedRouterOverrides = {
    navigate: (path: string) => window.location.assign(path),
    replace: (path: string) => window.location.replace(path),
    onSessionChange: () => window.location.reload(),
    Link: ({ href, to, children, ...props }: any) => (
      <a href={href || to || "#"} {...props}>
        {children}
      </a>
    ),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StackProvider
        basePath="/p"
        overrides={{
          auth: {
            authClient,
            ...sharedRouterOverrides,
            basePath: "/p/auth",
            redirectTo: "/p/account/settings",
          },
          account: {
            authClient,
            ...sharedRouterOverrides,
            basePath: "/p/account",
            account: { fields: ["image", "name"] },
          },
          organization: {
            authClient,
            ...sharedRouterOverrides,
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
