import { handler } from "@/lib/stack";

async function authenticatedHandler(request: Request) {
  const authBaseURL = process.env.AUTH_INTERNAL_URL ?? "http://auth:3000";
  const sessionResponse = await fetch(`${authBaseURL}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (!sessionResponse.ok) {
    return Response.json({ error: "Authentication service unavailable" }, { status: 502 });
  }

  const session = await sessionResponse.json();
  if (!session?.user) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  return handler(request);
}

export const GET = authenticatedHandler;
export const POST = authenticatedHandler;
export const PUT = authenticatedHandler;
export const PATCH = authenticatedHandler;
export const DELETE = authenticatedHandler;
