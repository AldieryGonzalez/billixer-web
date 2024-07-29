import { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { sessionLogin } from "~/lib/auth/auth.server";
import { parseFormBody } from "~/lib/zod";

const actionSchema = z.object({
  idToken: z.string(),
});

export type ActionData = z.infer<typeof actionSchema>;

export const action: ActionFunction = async ({ request }) => {
  const { idToken } = parseFormBody(actionSchema, await request.formData());
  return sessionLogin(request, idToken, "/");
};
