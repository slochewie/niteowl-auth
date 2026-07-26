import { StackProvider } from "@btst/stack/context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { authClient } from "~/lib/auth-client";
import { getOrCreateQueryClient } from "~/lib/query-client";

function resolvePath(value: unknown) {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    const candidate = value as { href?: unknown; to?: unknown; path?: unknown };
    const path = candidate.href ?? candidate.to ?? candidate.path;
    if (typeof path === "string") return path;
  }

  return "/";
}

export default function BtstPagesLayout() {
  const queryClient = getOrCreateQueryClient();

  const sharedRouterOverrides = {
    navigate: (value: unknown) => {
      window.location.href = resolvePath(value);
    },
    replace: (value: unknown) => {
      window.location.replace(resolvePath(value));
    },
    onSessionChange: () => window.location.reload(),
    Link: ({ href, to, children, onClick, ...props }: any) => {
      const destination = resolvePath(href ?? to);

      return (
        <a
          href={destination}
          {...props}
          onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented) return;

            event.preventDefault();
            event.stopPropagation();
            window.location.href = destination;
          }}
        >
          {children}
        </a>
      );
    },
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
