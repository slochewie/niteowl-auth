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

  // BTST plugins normally register routes without the catch-all mount prefix.
  // The organization UI currently links to /p/org/* while some releases
  // register those views under /organization/*. Resolve both forms so the
  // stock Manage Organization links work without changing upstream UI code.
  const candidatePaths = [
    path,
    pathname,
    path.replace(/^\/org(?=\/|$)/, "/organization"),
  ];
  const route = candidatePaths
    .map((candidate) => stackClient.router.getRoute(candidate))
    .find(Boolean);

  if (!route?.PageComponent) {
    return <main className="p-8">Route not found.</main>;
  }

  return <route.PageComponent />;
}
