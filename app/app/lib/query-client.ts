import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

export function getOrCreateQueryClient() {
  if (typeof window === "undefined") return new QueryClient();
  browserQueryClient ??= new QueryClient();
  return browserQueryClient;
}
