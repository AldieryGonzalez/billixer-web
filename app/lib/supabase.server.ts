import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { Database } from "database.types";

export const getSupabaseEnv = () => ({
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
});

export function getSupabaseWithHeaders({ request }: { request: Request }) {
  const headers = new Headers();
  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options),
            ),
          );
        },
      },
    },
  );

  return { supabase, headers };
}

export async function getSupabaseWithSessionHeaders({
  request,
}: {
  request: Request;
}) {
  const { supabase, headers } = getSupabaseWithHeaders({
    request,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session, headers, supabase };
}

export async function getSupabaseWithSessionHeadersAndUser({
  request,
}: {
  request: Request;
}) {
  const { session, supabase, headers } = await getSupabaseWithSessionHeaders({
    request,
  });
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (user == null) {
    throw new Error("User not found");
  }

  return { session, user, headers, supabase };
}
