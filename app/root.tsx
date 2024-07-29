import { LoaderFunctionArgs } from "@remix-run/node";
import {
  // json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { getFirebaseEnvs } from "firebase.config";
import Navbar from "./components/navbar";
import { Toaster } from "./components/ui/sonner";
import { FirebaseProvider } from "./contexts/firebase";
import { checkSession } from "./lib/auth/auth.server";
import "./tailwind.css";
import Envs from "./ui/envs";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const res = await checkSession(request);
  const firebaseEnvs = getFirebaseEnvs();
  return {
    loggedIn: res ? true : false,
    sesssionInfo: res,
    firebaseEnvs,
  };
};

export default function App() {
  const { sesssionInfo, loggedIn, firebaseEnvs } =
    useLoaderData<typeof loader>();
  sesssionInfo;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-svh">
        <FirebaseProvider firebaseEnvs={firebaseEnvs}>
          <Navbar loggedIn={loggedIn} />
          <div className="mx-4 mt-10 md:mx-16">
            <Outlet />
          </div>
        </FirebaseProvider>
        <Toaster />
        <ScrollRestoration />
        <Envs {...firebaseEnvs} />
        <Scripts />
      </body>
    </html>
  );
}
