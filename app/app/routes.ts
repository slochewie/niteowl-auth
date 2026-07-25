import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("health", "routes/health.ts"),
  route("api/auth/*", "routes/api/auth.$.ts"),
  route("api/data/*", "routes/api/data.$.ts"),
  layout("routes/p/_layout.tsx", [
    route("p/*", "routes/p/$.tsx"),
  ]),
] satisfies RouteConfig;
