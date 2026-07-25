import { StackProvider } from "@btst/stack/context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Link as RouterLink, Outlet, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
import { getOrCreateQueryClient } from "~/lib/query-client";

export default function BtstPagesLayout() {
  const navigate = useNavigate();
  const queryClient = getOrCreateQueryClient();

  const shared = {
    authClient,
    navigate: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    onSessionChange: () => window.location.reload(),
    Link: ({ href, to, ...props }: any) => (
      <RouterLink to={href || to || "#"} {...props} />
    ),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StackProvider
        basePath="/p"
        overrides={{
          auth: {
            ...shared,
            basePath: "/p/auth",
            redirectTo: "/p/account/settings",
          },
          account: {
            ...shared,
            basePath: "/p/account",
            account: { fields: ["image", "name"] },
          },
          organization: {
            ...shared,
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
