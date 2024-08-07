import { parseWithZod } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import { z, ZodObject, ZodRawShape } from "zod";

export const validateForm = <T extends ZodRawShape>(
    schema: ZodObject<T>,
    formData: FormData,
) => {
    const submission = parseWithZod(formData, {
        schema: schema,
    });
    if (submission.status !== "success") {
        return [false, submission.reply()];
    }
    return [true, submission.value];
};

export async function parseFormAndRun<T extends ZodRawShape>(
    formData: FormData,
    schema: ZodObject<T>,
    run: (
        payload: z.infer<typeof schema>,
        request: Request,
    ) => Promise<string | void>,
    request: Request,
    intent: string,
) {
    const submission = parseWithZod(formData, {
        schema,
    });
    if (submission.status !== "success") {
        return json({
            error: submission.reply(),
            status: "error" as const,
            intent,
            type: "ValidationError" as const,
        });
    }
    try {
        const res = await run(submission.value, request);
        if (res) {
            return redirect(`/${res}`);
        } else if (submission.value.tableCode) {
            return redirect(`/${submission.value.tableCode}`);
        }
        return redirect("/");
    } catch (error) {
        console.error(error);
        return json({
            error: (error as Error).message,
            status: "error" as const,
            intent,
            type: "FirebaseError" as const,
        });
    }
}
