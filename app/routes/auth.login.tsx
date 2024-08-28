// import { getFieldsetProps, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
    ActionFunction,
    // json,
    LoaderFunctionArgs,
    redirect,
} from "@remix-run/node";
// import {
//     Form,
//     useFetcher,
//     useLoaderData,
//     useNavigation,
// } from "@remix-run/react";
import { z } from "zod";
// import { FormInput } from "~/components/forms/components/input";
// import { GoogleIcon } from "~/components/icons/google";
// import { Button } from "~/components/ui/button";
// import { signInWithEmail, signInWithGoogle } from "~/lib/auth/auth";
import { sessionLogin } from "~/lib/auth/auth.server";
// import { useFirebase } from "~/lib/firebase";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const redirectUrl = url.searchParams.get("redirect") ?? "/";
    return redirect(redirectUrl);
    // const token = await checkSession(request);
    // if (token?.provider_id != "anonymous") {
    // }
    // return json({ redirect: redirectUrl });
};

// const LoginFormSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(6),
// });
// type LoginFormT = z.infer<typeof LoginFormSchema>;

// export default function Login() {
//     const { redirect } = useLoaderData<typeof loader>();
//     const fetcher = useFetcher();
//     const { auth } = useFirebase();
//     const [form, fields] = useForm<LoginFormT>({
//         shouldValidate: "onBlur",
//         shouldRevalidate: "onInput",
//         onSubmit: async (e, { submission }) => {
//             e.preventDefault();
//             if (submission && submission.status === "success") {
//                 const idToken = await signInWithEmail(
//                     auth,
//                     submission.value.email,
//                     submission.value.password,
//                 );
//                 if (!idToken) return console.error("No idToken");
//                 commitToken(idToken);
//             }
//         },
//         onValidate({ formData }) {
//             return parseWithZod(formData, { schema: LoginFormSchema });
//         },
//     });
//     const navigation = useNavigation();
//     const commitToken = (idToken: string) => {
//         fetcher.submit({ idToken, redirect } satisfies LoginActionDataT, {
//             method: "POST",
//             action: "/auth/login",
//         });
//     };
//     const googleSignIn = async () => {
//         const idToken = await signInWithGoogle(auth);
//         if (!idToken) return console.error("No idToken");
//         commitToken(idToken);
//     };

//     const loading = navigation.formAction == "/auth/login";
//     return (
//         <div className="mx-auto my-8 max-w-sm space-y-2">
//             <h1 className="text-center text-xl font-bold">Login</h1>
//             <Form
//                 method="POST"
//                 {...getFormProps(form)}
//                 className="space-y-4 rounded-md bg-white p-4 shadow"
//             >
//                 <fieldset
//                     {...getFieldsetProps}
//                     disabled={loading}
//                     className="flex flex-col gap-3"
//                 >
//                     <FormInput meta={fields.email} label="Email" />
//                     <FormInput meta={fields.password} label="Password" />
//                     <Button type="submit" className="h-8">
//                         Login
//                     </Button>
//                 </fieldset>
//                 <div className="grid grid-cols-[1fr_3ch_1fr] items-center">
//                     <div className="h-px bg-gray-300"></div>
//                     <div className="text-center text-gray-500">or</div>
//                     <div className="h-px bg-gray-300"></div>
//                 </div>
//                 <div>
//                     <Button
//                         className="mx-auto flex h-10 justify-start rounded-full px-3 font-normal"
//                         type="button"
//                         onClick={googleSignIn}
//                     >
//                         <GoogleIcon className="h-5 pr-[10px]" />
//                         Sign in with Google
//                     </Button>
//                 </div>
//             </Form>
//         </div>
//     );
// }
