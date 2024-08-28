import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { action } from "~/routes/_index";
import { Spinner } from "../loading/spinner";
import { Button } from "../ui/button";
import { FormInput } from "./components/input";

export const JoinTableSchema = z.object({
    type: z.literal("join"),
    tableCode: z
        .string()
        .length(6, "Table Code must be 6 characters")
        .regex(/^[a-zA-Z0-9]*$/, "Table Code must be alphanumeric"),
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, { message: "Must input a name" }),
});
export type JoinTableSchemaT = z.infer<typeof JoinTableSchema>;

export default function JoinForm({
    defaultCode,
}: {
    defaultCode: string | null;
}) {
    const actionResult = useActionData<typeof action>();

    const s =
        actionResult?.status === "error" &&
        actionResult.type === "ValidationError"
            ? actionResult
            : null;
    const [form, fields] = useForm<JoinTableSchemaT>({
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        lastResult: s?.error,
        defaultValue: { tableCode: defaultCode },
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: JoinTableSchema });
        },
    });
    const navigation = useNavigation();
    const loading = navigation.formAction == "/?index";
    return (
        <Form
            method="POST"
            {...getFormProps(form)}
            className="w-full grow rounded-md border bg-white p-6 shadow-xl"
        >
            <fieldset disabled={loading}>
                <h3 className="text-xl font-semibold">Join table</h3>
                <input
                    {...getInputProps(fields.type, { type: "hidden" })}
                    key={fields.type.key}
                    value="join"
                />
                <div className="space-y-4">
                    <FormInput
                        meta={fields.tableCode}
                        label="Table Code"
                        placeholder="Table Code (6 characters)"
                        autoComplete="off"
                        maxLength={6}
                    />
                    <FormInput
                        meta={fields.name}
                        label="Name"
                        autoComplete="off"
                    />
                </div>
                <Button
                    type="submit"
                    className="mt-2 w-full rounded-md bg-sky-500 p-2 text-white"
                >
                    {loading ? <Spinner /> : "Join"}
                </Button>
            </fieldset>
        </Form>
    );
}
