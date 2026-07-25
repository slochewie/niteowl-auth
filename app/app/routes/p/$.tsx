import {
  HydrationBoundary,
  dehydrate,
  useQueryClient,
} from "@tanstack/react-query";
import { useLoaderData, useRouteError } from "react-router";
import { getOrCreateQueryClient } from "~/lib/query-client";
import { getStackClient } from "~/lib/stack-client";

function normalizePath(path?: string) {
  if (!path) return "/";
  const segments = path.split("/").filter(Boolean);
  return segments.length > 0 ? `/${segments.join("/")}` : "/";
}

export async function loader({ params }: { params: Record<string, string | undefined> }) {
  const queryClient = getOrCreateQueryClient();
  const path = normalizePath(params["*"]);
  const route = getStackClient(queryClient).router.getRoute(path);

  if (route?.loader) {
    await route.loader();
  }

  return {
    path,
    dehydratedState: dehydrate(queryClient, {
      shouldDehydrateQuery: () => true,
    }),
    meta: await route?.meta?.(),
  };
}

export function meta({ loaderData }: { loaderData?: Awaited<ReturnType<typeof loader>> }) {
  return loaderData?.meta;
}

export default function BtstPage() {
  const data = useLoaderData<typeof loader>();
  const queryClient = useQueryClient();
  const route = getStackClient(queryClient).router.getRoute(data.path);

  return (
    <HydrationBoundary state={data.dehydratedState}>
      {route?.PageComponent ? <route.PageComponent /> : <div>Route not found</div>}
    </HydrationBoundary>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <pre>{String(error)}</pre>;
}
