import { ActionFunction } from "@remix-run/node";
import { sessionLogout } from "~/lib/auth/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return sessionLogout(request, "/");
};
