import { parseWithZod } from "@conform-to/zod";
import { ActionFunction, redirect } from "@remix-run/node";
import { z } from "zod";
import { sessionLogin } from "~/lib/auth/auth.server";

const actionSchema = z.object({
    idToken: z.string(),
});

export type ActionData = z.infer<typeof actionSchema>;

export const action: ActionFunction = async ({ request }) => {
    const submission = parseWithZod(await request.formData(), {
        schema: actionSchema,
    });
    if (submission.status !== "success") {
        throw redirect("/", { status: 400, statusText: "malformed token" });
    }

    return sessionLogin(request, submission.value.idToken, "/");
};
