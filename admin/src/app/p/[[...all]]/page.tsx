"use client";

import { usePathname } from "next/navigation";
import { getStackClient } from "@/lib/stack-client";

export default function BtstPage() {
  const pathname = usePathname();
  const path = pathname.replace(/^\/p(?=\/|$)/, "") || "/";
  const route = getStackClient().router.getRoute(path);

  if (!route?.PageComponent) {
    return <main className="p-8">Route not found.</main>;
  }

  return <route.PageComponent />;
}
