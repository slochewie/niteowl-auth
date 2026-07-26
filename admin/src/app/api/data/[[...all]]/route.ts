import { toNextRouteHandlers } from "@btst/stack/next";
import { handler } from "@/lib/stack";

export const { GET, POST, PUT, PATCH, DELETE } = toNextRouteHandlers(handler);
