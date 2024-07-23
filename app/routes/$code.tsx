import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Outlet,
  useLoaderData,
  useOutletContext,
  useRouteError,
} from "@remix-run/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";
import { useRealtimeTable } from "~/lib/realtime.table";
import { getSupabaseWithSessionHeadersAndUser } from "~/lib/supabase.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { headers, session, supabase, user } =
    await getSupabaseWithSessionHeadersAndUser({
      request,
    });
  if (!params.code) {
    return redirect("/");
  }
  if (!session) {
    return redirect("/");
  }

  const tableData = await supabase
    .from("mesa")
    .select(
      `
      *, 
      table_users (
        *
      ),
      items (
        id, mods, name, price,
        users:user_items (*)
      ),
      users (
        *
      )
      `,
    )
    .eq("code", params.code)
    .single();
  if (tableData.error) {
    throw new Error("Table not found");
  }

  return json({ table: tableData, user, code: params.code }, { headers });
}

export type TableContextType = ReturnType<typeof useLoaderData<typeof loader>>;
export default function TableLayout() {
  const { table, user, code } = useLoaderData<typeof loader>();
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient<Database>;
  }>();
  const tableData = {
    data: useRealtimeTable({ initialData: table.data, supabase, code }),
  };
  return <Outlet context={{ table: tableData, user }} />;
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
