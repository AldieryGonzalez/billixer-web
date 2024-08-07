import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
    isRouteErrorResponse,
    json,
    Outlet,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import { LoadingBillixer } from "~/components/loading/logo";

import { useFirebase } from "~/contexts/firebase";
import { checkSession } from "~/lib/auth/auth.server";
import { useTable } from "~/lib/db/firestore";

export async function loader({ request, params }: LoaderFunctionArgs) {
    if (!params.code) {
        return redirect("/");
    }
    const sessionInfo = await checkSession(request);
    if (!sessionInfo) {
        console.error("No session found");
        return redirect("/");
    }

    return json({ session: sessionInfo, code: params.code });
}

export type TableContextType = {
    session: ReturnType<typeof useLoaderData<typeof loader>>["session"];
    data: NonNullable<ReturnType<typeof useTable>["data"]>;
};
export default function TableLayout() {
    const { session, code } = useLoaderData<typeof loader>();
    const { db } = useFirebase();
    const { data, error } = useTable(db, code);
    if (error) {
        throw error;
    }
    if (!data) {
        return <LoadingBillixer />;
    }
    return <Outlet context={{ session, data } as TableContextType} />;
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
