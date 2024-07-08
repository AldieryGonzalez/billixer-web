import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export const getSupabaseEnv = () => ({
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
});

export function getSupabaseWithHeaders({ request }: { request: Request }) {
  const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
  const headers = new Headers();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(key, value, options),
          );
        },
        remove(key, options) {
          headers.append("Set-Cookie", serializeCookieHeader(key, "", options));
        },
      },
      auth: {
        detectSessionInUrl: true,
        flowType: "pkce",
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
