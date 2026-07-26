"use client";

import { CommentThread } from "@btst/stack/plugins/comments/client/components";
import { authClient } from "@/lib/auth-client";

export function BlogComments({ post }: { post: { slug: string } }) {
  const { data: session } = authClient.useSession();
  const siteBaseURL =
    typeof window === "undefined"
      ? process.env.ADMIN_URL ?? "http://localhost:3030"
      : window.location.origin;

  return (
    <CommentThread
      resourceId={post.slug}
      resourceType="blog-post"
      apiBaseURL={siteBaseURL}
      apiBasePath="/api/data"
      currentUserId={session?.user.id}
      loginHref="/p/auth/sign-in"
    />
  );
}
