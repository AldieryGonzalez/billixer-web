import type { SupabaseClient } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";
import Logo from "./icons/logo";

type NavbarProps = {
  session: Session | null;
  supabase: SupabaseClient;
};

export default function Navbar({ session, supabase }: NavbarProps) {
  const loggedOut = session == null;
  function login() {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }
  async function logout() {
    if (!session) return;
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error.message);
  }

  return (
    <header className="relative flex h-14 items-center justify-end bg-emerald-500 px-4 md:px-16">
      <div className="absolute left-4 flex gap-2 font-lobster text-4xl md:left-1/2 md:-translate-x-1/2">
        <h1 className="text-4xl">Billixer</h1>
        <Logo className="aspect-square h-10" />
      </div>
      <nav>
        <ul className="flex space-x-4">
          {loggedOut ? (
            <button
              onClick={login}
              className="rounded border border-white bg-white px-2 py-1 text-sm font-semibold shadow-md hover:bg-white/75"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={logout}
              className="rounded border border-white bg-white px-2 py-1 text-sm font-semibold shadow-md hover:bg-white/75"
            >
              Sign Out
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
}
