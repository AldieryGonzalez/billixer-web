import { LoaderFunctionArgs } from "@remix-run/node";
import {
    // json,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useFetcher,
    useLoaderData,
} from "@remix-run/react";
import { getFirebaseEnvs } from "firebase.config";
import { signInAnonymously } from "firebase/auth";
import { useEffect } from "react";
import Navbar from "./components/navbar/navbar";
import { Toaster } from "./components/ui/sonner";
import { checkSession } from "./lib/auth/auth.server";
import { useFirebase } from "./lib/firebase";
import { LoginActionDataT } from "./routes/auth.login";
import "./tailwind.css";
import Envs, { FirebaseConfig } from "./ui/envs";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const res = await checkSession(request);
    const firebaseEnvs = getFirebaseEnvs() satisfies FirebaseConfig;
    return {
        loggedIn: res ? true : false,
        sessionInfo: res,
        firebaseEnvs,
    };
};

export default function App() {
    const { sessionInfo, loggedIn, firebaseEnvs } =
        useLoaderData<typeof loader>();
    const { auth } = useFirebase(true);
    const fetcher = useFetcher();
    useEffect(() => {
        async function fetchData() {
            if (!loggedIn && !auth.currentUser) {
                const user = await signInAnonymously(auth);
                const idToken = await user.user.getIdToken();
                fetcher.submit(
                    { idToken, redirect: "/" } satisfies LoginActionDataT,
                    {
                        method: "POST",
                        action: "/auth/login",
                    },
                );
            }
        }
        fetchData();
    }, [auth, loggedIn, fetcher]);
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <div className="flex h-svh min-h-svh flex-col">
                    <Navbar sessionInfo={sessionInfo} />
                    <div className="flex h-full grow">
                        <Outlet />
                    </div>
                </div>
                <Toaster />
                <ScrollRestoration />
                <Envs {...firebaseEnvs} />
                <Scripts />
            </body>
        </html>
    );
}
