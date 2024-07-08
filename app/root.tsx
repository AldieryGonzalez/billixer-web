import { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Navbar from "./components/navbar";
import { Toaster } from "./components/ui/sonner";
import { useSupabase } from "./lib/supabase";
import {
  getSupabaseEnv,
  getSupabaseWithSessionHeaders,
} from "./lib/supabase.server";
import "./tailwind.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, headers } = await getSupabaseWithSessionHeaders({
    request,
  });
  const domainUrl = process.env.DOMAIN_URL;
  return json(
    {
      env: getSupabaseEnv(),
      session,
      domainUrl,
    },
    { headers },
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-svh">
        <Navbar />
        <div className="mx-4 mt-10 md:mx-16">{children}</div>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { env, session, domainUrl } = useLoaderData<typeof loader>();
  const { supabase } = useSupabase({ env, session });
  return <Outlet context={{ supabase, domainUrl }} />;
}
