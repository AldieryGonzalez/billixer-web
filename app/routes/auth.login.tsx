import { parseWithZod } from "@conform-to/zod";
import { ActionFunction, redirect } from "@remix-run/node";
import { z } from "zod";
import { sessionLogin } from "~/lib/auth/auth.server";

const LoginActionSchema = z.object({
    idToken: z.string(),
    redirect: z.string().optional(),
});

export type LoginActionDataT = z.infer<typeof LoginActionSchema>;

export const action: ActionFunction = async ({ request }) => {
    const submission = parseWithZod(await request.formData(), {
        schema: LoginActionSchema,
    });
    if (submission.status !== "success") {
        throw redirect("/", { status: 400, statusText: "malformed token" });
    }
    return sessionLogin(
        request,
        submission.value.idToken,
        submission.value.redirect,
    );
};
