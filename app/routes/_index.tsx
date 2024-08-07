import { parseWithZod } from "@conform-to/zod";
import {
    json,
    redirect,
    type ActionFunctionArgs,
    type MetaFunction,
} from "@remix-run/node";
import {
    isRouteErrorResponse,
    Navigate,
    useActionData,
    useRouteError,
} from "@remix-run/react";
import { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { useEffect } from "react";
import { toast } from "sonner";
import CreateDialog from "~/components/create-dialog/index";
import {
    CreateTableSchema,
    CreateTableSchemaT,
} from "~/components/forms/create-form";
import JoinForm, {
    JoinTableSchema,
    JoinTableSchemaT,
} from "~/components/forms/join-form";
import { createTable, joinTable } from "~/lib/db/firestore.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Billixer" },
        { name: "description", content: "App for splitting checks and bills" },
    ];
};

const handleCreateTable = async (
    payload: CreateTableSchemaT,
    request: Request,
) => {
    const code = await createTable(payload, request);
    return redirect(`/${code}`);
};

const handleJoinTable = async (payload: JoinTableSchemaT, request: Request) => {
    await joinTable(payload, request);
    return redirect(`/${payload.tableCode}`);
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const intent = formData.get("type") as "create" | "join" | null;
    switch (intent) {
        case "create": {
            const submission = parseWithZod(formData, {
                schema: CreateTableSchema,
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
                await handleCreateTable(submission.value, request);
                return json({
                    errors: null,
                    status: "success" as const,
                    intent,
                    type: null,
                });
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
        case "join": {
            const submission = parseWithZod(formData, {
                schema: JoinTableSchema,
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
                await handleJoinTable(submission.value, request);
                return json({
                    error: null,
                    status: "success" as const,
                    intent,
                    type: null,
                });
            } catch (error) {
                return json({
                    error: (error as Error).message,
                    status: "error" as const,
                    intent,
                    type: "FirebaseError" as const,
                });
            }
        }
        default:
            return json({
                error: "Invalid Request",
                status: "error" as const,
                intent,
                type: "InvalidRequest" as const,
            });
    }
};

export default function Index() {
    const result = useActionData<typeof action>();
    useEffect(() => {
        if (result && result.status == "error") {
            if (result.type === "ValidationError") {
                toast.error(result.error.fields);
            } else if (result.type === "FirebaseError") {
                toast.error(result.error, {
                    dismissible: true,
                    richColors: true,
                    duration: 2000,
                });
            } else {
                toast.error("An error occurred");
            }
        }
    }, [result]);
    return (
        <div className="flex h-full flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="flex flex-col items-start justify-start gap-1 text-start lg:self-start">
                <h1 className="text-3xl lg:text-6xl">
                    Welcome to{" "}
                    <span className="font-lobster text-paynesGray lg:text-7xl">
                        Billixer
                    </span>
                </h1>
                <p>App for splitting checks and bills</p>
                {/* TODO: Add List of features and pie chart graphic to fill desktop mode */}
            </div>
            <div className="min-w-80 max-w-md grow">
                <JoinForm />
                <p className="mt-4 text-center">or</p>
                <CreateDialog />
            </div>
        </div>
    );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
    const error = useRouteError();
    console.error(error);
    if (isRouteErrorResponse(error)) {
        return <Navigate to="/" />;
    }
};
