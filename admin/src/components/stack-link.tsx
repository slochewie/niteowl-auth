"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

export function StackLink({
  href,
  ...props
}: ComponentProps<"a"> & Record<string, unknown>) {
  return <Link href={typeof href === "string" ? href : "#"} {...props} />;
}
