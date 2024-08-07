import { parseWithZod } from "@conform-to/zod";
import { ZodObject, ZodRawShape } from "zod";

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
