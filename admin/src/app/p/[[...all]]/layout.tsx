"use client";

import type {
  AccountPluginOverrides,
  AuthPluginOverrides,
  OrganizationPluginOverrides,
} from "@btst/better-auth-ui/client";
import { StackProvider } from "@btst/stack/context";
import type { CMSPluginOverrides } from "@btst/stack/plugins/cms/client";
import type { BlogPluginOverrides } from "@btst/stack/plugins/blog/client";
import type { CommentsPluginOverrides } from "@btst/stack/plugins/comments/client";
import type { FormBuilderPluginOverrides } from "@btst/stack/plugins/form-builder/client";
import {
  defaultComponentRegistry,
  type UIBuilderPluginOverrides,
} from "@btst/stack/plugins/ui-builder/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { BlogComments } from "@/components/blog-comments";
import { StackLink } from "@/components/stack-link";

type Overrides = {
  auth: AuthPluginOverrides;
  account: AccountPluginOverrides;
  organization: OrganizationPluginOverrides;
  blog: BlogPluginOverrides;
  cms: CMSPluginOverrides;
  comments: CommentsPluginOverrides;
  "form-builder": FormBuilderPluginOverrides;
  "ui-builder": UIBuilderPluginOverrides;
};

function readFileAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

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
          blog: {
            apiBaseURL: siteBaseURL,
            apiBasePath: "/api/data",
            navigate: router.push,
            refresh: router.refresh,
            Link: StackLink,
            uploadImage: readFileAsDataURL,
            postBottomSlot: (post) => <BlogComments post={post} />,
          },
          cms: {
            apiBaseURL: siteBaseURL,
            apiBasePath: "/api/data",
            navigate: router.push,
            refresh: router.refresh,
            Link: StackLink,
          },
          comments: {
            apiBaseURL: siteBaseURL,
            apiBasePath: "/api/data",
            currentUserId: async () =>
              (await authClient.getSession()).data?.user.id,
            loginHref: "/p/auth/sign-in",
            resourceLinks: {
              "blog-post": (slug) => `/p/blog/${slug}`,
            },
          },
          "form-builder": {
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
