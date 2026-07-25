import { handler } from "~/lib/stack";

export function loader({ request }: { request: Request }) {
  return handler(request);
}

export function action({ request }: { request: Request }) {
  return handler(request);
}
