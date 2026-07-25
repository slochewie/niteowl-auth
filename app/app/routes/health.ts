export function loader() {
  return Response.json({
    ok: true,
    service: "niteowl-auth",
    environment: process.env.NODE_ENV ?? "unknown",
  });
}
