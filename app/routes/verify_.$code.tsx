import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { FormInput as Input } from "~/components/forms/components/input";
import { Button } from "~/components/ui/button";
import { useFirebase } from "~/contexts/firebase";
import { signInWithAnon } from "~/lib/auth/auth";
import { checkSession } from "~/lib/auth/auth.server";
import { LoginActionDataT } from "./auth.login";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    if (!params.code) {
        return redirect("/");
    }
    const token = await checkSession(request);

    return json({
        code: params.code,
        user: token?.uid,
    });
};

const FormSchema = z.object({
    name: z.string(),
});
type FormSchemaT = z.infer<typeof FormSchema>;

export default function VerifyCode() {
    const { code: tableCode } = useLoaderData<typeof loader>();
    const authFetcher = useFetcher();
    const fetcher = useFetcher();
    const { auth } = useFirebase();
    const [form, fields] = useForm<FormSchemaT>({
        constraint: getZodConstraint(FormSchema),
        shouldValidate: "onSubmit",
        shouldRevalidate: "onInput",
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: FormSchema });
        },
        async onSubmit(e, { submission }) {
            e.preventDefault();
            if (submission?.status !== "success") return;
            await login();
        },
    });

    async function login() {
        const idToken = await signInWithAnon(auth);
        if (!idToken) return console.error("No idToken");
        authFetcher.submit(
            { idToken, redirect: `/${tableCode}` } satisfies LoginActionDataT,
            {
                method: "POST",
                action: "/auth/login",
            },
        );
    }

    return (
        <fetcher.Form
            {...getFormProps(form)}
            className="m-auto flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg"
        >
            <h1 className="text-2xl font-bold">Join Table</h1>
            <Input label="Name" meta={fields.name} type="text" />
            <Button type="submit">Submit</Button>
        </fetcher.Form>
    );
}
