import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { FormInput } from "~/components/forms/components/input";
import { FormSwitch } from "~/components/forms/components/switch";
import { Button } from "~/components/ui/button";
import { action } from "~/routes/_index";
import { Spinner } from "../loading/spinner";

export const CreateTableSchema = z.object({
    type: z.literal("create"),
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, { message: "Must input a name" }),
    title: z
        .string({ required_error: "Title is required" })
        .trim()
        .min(1, { message: "Must input a title" }),
    description: z.string().optional(),
    waitingRoom: z.boolean().default(true),
});

export type CreateTableSchemaT = z.infer<typeof CreateTableSchema>;

function CreateForm() {
    const actionResult = useActionData<typeof action>();
    const s =
        actionResult?.status === "error" &&
        actionResult.type === "ValidationError"
            ? actionResult
            : null;
    const [form, fields] = useForm<CreateTableSchemaT>({
        constraint: getZodConstraint(CreateTableSchema),
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        lastResult: s?.error,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: CreateTableSchema });
        },
    });
    const navigation = useNavigation();
    const loading = navigation.formAction == "/?index";
    return (
        <Form
            method="POST"
            {...getFormProps(form)}
            className="max-h-96 w-full overflow-auto px-2"
        >
            <fieldset disabled={loading} className="flex flex-col gap-y-2">
                <input
                    {...getInputProps(fields.type, { type: "hidden" })}
                    key={fields.type.key}
                    value="create"
                />
                <FormInput meta={fields.name} label="Name" autoComplete="off" />
                <FormInput
                    meta={fields.title}
                    label="Title"
                    autoComplete="off"
                />
                <FormInput
                    meta={fields.description}
                    label="Description"
                    autoComplete="off"
                />
                <FormSwitch
                    meta={fields.waitingRoom}
                    label="Enable waiting room"
                    defaultChecked
                />
                <Button disabled={!form.valid} type="submit">
                    {loading ? <Spinner /> : "Create Table"}
                </Button>
            </fieldset>
        </Form>
    );
}

export default CreateForm;
