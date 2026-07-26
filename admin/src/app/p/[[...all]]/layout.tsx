"use client";

import type {
  AccountPluginOverrides,
  AuthPluginOverrides,
  OrganizationPluginOverrides,
} from "@btst/better-auth-ui/client";
import { StackProvider } from "@btst/stack/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

type Overrides = {
  auth: AuthPluginOverrides;
  account: AccountPluginOverrides;
  organization: OrganizationPluginOverrides;
};

export default function PagesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const shared = {
    authClient,
    navigate: router.push,
    replace: router.replace,
    onSessionChange: () => router.refresh(),
    Link,
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
        }}
      >
        {children}
      </StackProvider>
    </QueryClientProvider>
  );
}
