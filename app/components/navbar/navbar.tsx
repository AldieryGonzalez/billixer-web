import { useFetcher } from "@remix-run/react";
import { signInWithGoogle } from "~/lib/auth/auth";
import { useFirebase } from "~/lib/firebase";
import { LoginActionDataT } from "~/routes/auth.login";
import Logo from "../icons/logo";

type NavbarProps = {
    provider: string | undefined;
};

export default function Navbar({ provider }: NavbarProps) {
    const fetcher = useFetcher();
    const { auth } = useFirebase();
    async function login() {
        const idToken = await signInWithGoogle(auth);
        if (!idToken) return console.error("No idToken");
        fetcher.submit({ idToken, redirect: "/" } satisfies LoginActionDataT, {
            method: "POST",
            action: "/auth/login",
        });
    }
    // async function logout() {
    //     if (!provider) return;
    //     fetcher.submit({}, { method: "POST", action: "/auth/logout" });
    // }
    const isAnon = provider === "anonymous";
    console.log({ provider });

    return (
        <header className="relative flex h-14 min-h-12 items-center justify-end bg-emerald-500 px-4 md:px-16">
            <div className="absolute left-4 flex gap-2 font-lobster text-4xl md:left-1/2 md:-translate-x-1/2">
                <h1 className="text-4xl">Billixer</h1>
                <Logo className="aspect-square h-10" />
            </div>
            <nav>
                <ul className="flex space-x-4">
                    {isAnon && (
                        <button
                            onClick={login}
                            className="rounded border border-white bg-white px-2 py-1 text-sm font-semibold shadow-md hover:bg-white/75"
                        >
                            Connect to Google
                        </button>
                    )}
                </ul>
            </nav>
        </header>
    );
}
