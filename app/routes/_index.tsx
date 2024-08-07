import { parseWithZod } from "@conform-to/zod";
import {
    redirect,
    type ActionFunction,
    type MetaFunction,
} from "@remix-run/node";
import {
    isRouteErrorResponse,
    Navigate,
    useRouteError,
} from "@remix-run/react";
import { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
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
    try {
        const code = await createTable(payload, request);
        return redirect(`/${code}`);
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
};

const handleJoinTable = async (payload: JoinTableSchemaT, request: Request) => {
    try {
        await joinTable(payload, request);
        return redirect(`/${payload.tableCode}`);
    } catch (error) {
        console.error(error);
        return new Response(null, {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionIntent = formData.get("type");
    switch (actionIntent) {
        case "create": {
            const submission = parseWithZod(formData, {
                schema: CreateTableSchema,
            });
            if (submission.status !== "success") {
                return submission.reply();
            }
            return await handleCreateTable(submission.value, request);
        }
        case "join": {
            const submission = parseWithZod(formData, {
                schema: JoinTableSchema,
            });
            if (submission.status !== "success") {
                return submission.reply();
            }
            return await handleJoinTable(submission.value, request);
        }
        default:
            throw new Response("Invalid form data", {
                status: 403,
                statusText: "Invalid Data",
            });
    }
};

export default function Index() {
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
