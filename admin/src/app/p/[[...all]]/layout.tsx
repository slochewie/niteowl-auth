"use client";

import type {
  AccountPluginOverrides,
  AuthPluginOverrides,
  OrganizationPluginOverrides,
} from "@btst/better-auth-ui/client";
import { StackProvider } from "@btst/stack/context";
import { nextRouter } from "@btst/stack/next";
import type { BlogPluginOverrides } from "@btst/stack/plugins/blog/client";
import type { CMSPluginOverrides } from "@btst/stack/plugins/cms/client";
import type { CommentsPluginOverrides } from "@btst/stack/plugins/comments/client";
import type { FormBuilderPluginOverrides } from "@btst/stack/plugins/form-builder/client";
import {
  defaultComponentRegistry,
  type UIBuilderPluginOverrides,
} from "@btst/stack/plugins/ui-builder/client";
import { QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { getOrCreateQueryClient } from "@/lib/query-client";

type PluginOverrides = {
  auth: AuthPluginOverrides;
  account: AccountPluginOverrides;
  organization: OrganizationPluginOverrides;
  blog: BlogPluginOverrides;
  cms: CMSPluginOverrides;
  comments: CommentsPluginOverrides;
  "form-builder": FormBuilderPluginOverrides;
  "ui-builder": UIBuilderPluginOverrides;
};

const getBaseURL = () =>
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.ADMIN_URL ?? "http://localhost:3030";

export default function PagesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(() => getOrCreateQueryClient());
  const baseURL = getBaseURL();

  const authConfig = {
    authClient,
    navigate: router.push,
    replace: router.replace,
    onSessionChange: () => router.refresh(),
    Link,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StackProvider<PluginOverrides>
        basePath="/p"
        router={nextRouter()}
        api={{ baseURL, basePath: "/api/data" }}
        overrides={{
          auth: {
            ...authConfig,
            basePath: "/p/auth",
            redirectTo: "/p/account/settings",
          },
          account: {
            ...authConfig,
            basePath: "/p/account",
            account: { fields: ["image", "name"] },
          },
          organization: {
            ...authConfig,
            basePath: "/p/org",
            organization: { basePath: "/p/org" },
          },
          blog: {},
          cms: {},
          comments: {},
          "form-builder": {},
          "ui-builder": {
            componentRegistry: defaultComponentRegistry,
          },
        }}
      >
        {children}
      </StackProvider>
    </QueryClientProvider>
  );
}
