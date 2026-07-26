"use client";

import type {
  AccountPluginOverrides,
  AuthPluginOverrides,
  OrganizationPluginOverrides,
} from "@btst/better-auth-ui/client";
import { StackProvider } from "@btst/stack/context";
import type { CMSPluginOverrides } from "@btst/stack/plugins/cms/client";
import {
  defaultComponentRegistry,
  type UIBuilderPluginOverrides,
} from "@btst/stack/plugins/ui-builder/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { StackLink } from "@/components/stack-link";

type Overrides = {
  auth: AuthPluginOverrides;
  account: AccountPluginOverrides;
  organization: OrganizationPluginOverrides;
  cms: CMSPluginOverrides;
  "ui-builder": UIBuilderPluginOverrides;
};

export default function PagesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const siteBaseURL =
    typeof window === "undefined"
      ? process.env.ADMIN_URL ?? "http://localhost:3030"
      : window.location.origin;
  const shared = {
    authClient,
    navigate: router.push,
    replace: router.replace,
    onSessionChange: () => router.refresh(),
    Link: StackLink,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StackProvider<Overrides>
        basePath="/p"
        overrides={{
          auth: { ...shared, basePath: "/p/auth", redirectTo: "/p/account/settings" },
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
          cms: {
            apiBaseURL: siteBaseURL,
            apiBasePath: "/api/data",
            navigate: router.push,
            refresh: router.refresh,
            Link: StackLink,
          },
          "ui-builder": {
            apiBaseURL: siteBaseURL,
            apiBasePath: "/api/data",
            siteBasePath: "/p",
            navigate: router.push,
            refresh: router.refresh,
            Link: StackLink,
            componentRegistry: defaultComponentRegistry,
          },
        }}
      >
        {children}
      </StackProvider>
    </QueryClientProvider>
  );
}
