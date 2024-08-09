import {
    json,
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
import { CreateTableSchema } from "~/components/forms/create-form";
import JoinForm, { JoinTableSchema } from "~/components/forms/join-form";
import { createTable, joinTable } from "~/lib/db/firestore.server";
import { parseFormAndRun } from "~/lib/zod";

export const meta: MetaFunction = () => {
    return [
        { title: "Billixer" },
        { name: "description", content: "App for splitting checks and bills" },
    ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const intent = formData.get("type") as "create" | "join" | null;
    switch (intent) {
        case "create": {
            return parseFormAndRun(
                formData,
                CreateTableSchema,
                createTable,
                request,
                "create",
            );
        }
        case "join": {
            return parseFormAndRun(
                formData,
                JoinTableSchema,
                joinTable,
                request,
                "join",
            );
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
        <div className="m-8 flex h-full flex-col items-center justify-between gap-6 lg:mx-20 lg:mt-16 lg:flex-row">
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
