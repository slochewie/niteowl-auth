import {
  HydrationBoundary,
  dehydrate,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useLoaderData,
  useRouteError,
  type ActionFunctionArgs,
} from "react-router";
import { auth } from "~/lib/auth.server";
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

export async function action({ request, params }: ActionFunctionArgs) {
  const path = normalizePath(params["*"]);

  if (path !== "/auth/sign-up") {
    return new Response("Method not allowed", { status: 405 });
  }

  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const response = await auth.api.signUpEmail({
    body: { name, email, password },
    headers: request.headers,
    asResponse: true,
  });

  if (!response.ok) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("Location", "/p/account/settings");

  return new Response(null, {
    status: 303,
    headers,
  });
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
