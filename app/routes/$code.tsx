import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { getSupabaseWithSessionHeaders } from "~/lib/supabase.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { headers, session, supabase } = await getSupabaseWithSessionHeaders({
    request,
  });
  if (!params.code) {
    console.log("No code");
    return redirect("/");
  }
  console.log(JSON.stringify(session));
  if (!session) {
    console.log("No session");
    return redirect("/");
  }

  const tableData = await supabase
    .from("mesa")
    .select(
      `
      *, 
      users:table_users (
        admin, confirmed, paid,
        user_info:user_id (*),
        cardholder_info:cardholder_user_id (*)
      ),
      items (
        mods, name, price,
        users:user_items (*)
      )
      `,
    )
    .eq("code", params.code)
    .single();
  if (tableData.error) {
    throw new Error("Table not found");
  }

  return json({ table: tableData, session }, { headers });
}

export default function TableLayout() {
  const {
    table: { data: table },
    session,
  } = useLoaderData<typeof loader>();

  return <Outlet context={{ table, session }} />;
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
