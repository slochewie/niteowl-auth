import { toReactRouterHandlers } from "@btst/stack/react-router";
import { handler } from "~/lib/stack";

const handlers = toReactRouterHandlers(handler);
export const loader = handlers.loader;
export const action = handlers.action;
