import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.code) {
    return redirect("/");
  }

  return json({ code: params.code });
}

export type TableContextType = ReturnType<typeof useLoaderData<typeof loader>>;
export default function TableLayout() {
  const { code } = useLoaderData<typeof loader>();

  return <Outlet context={{ code }} />;
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
