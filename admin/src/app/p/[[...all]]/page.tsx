"use client";

import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { getStackClient } from "@/lib/stack-client";

export default function BtstPage() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const stackClient = useMemo(() => getStackClient(queryClient), [queryClient]);
  const path = pathname.replace(/^\/p(?=\/|$)/, "") || "/";
  const route = stackClient.router.getRoute(path);

  if (!route?.PageComponent) {
    return <main className="p-8">Route not found.</main>;
  }

  return <route.PageComponent />;
}
