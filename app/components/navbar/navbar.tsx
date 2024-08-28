import { useLoaderData } from "@remix-run/react";
import { loader } from "~/root";
import Logo from "../icons/logo";
// import { Button } from "../ui/button";

type NavbarPropsT = {
    sessionInfo: ReturnType<typeof useLoaderData<typeof loader>>["sessionInfo"];
};

export default function Navbar({ sessionInfo }: NavbarPropsT) {
    const loggedIn =
        sessionInfo !== null &&
        sessionInfo.firebase.sign_in_provider !== "anonymous";
    loggedIn;
    return (
        <header className="relative flex h-14 min-h-12 items-center justify-end bg-emerald-500 px-4 md:px-16">
            <div className="absolute left-4 flex gap-2 font-lobster text-4xl md:left-1/2 md:-translate-x-1/2">
                <h1 className="text-4xl">Billixer</h1>
                <Logo className="aspect-square h-10" />
            </div>
            {/* <nav>
                {!loggedIn ? (
                    <ul className="flex space-x-4">
                        <Button variant="outline" size="xs" asChild>
                            <Link to="/auth/login">Login</Link>
                        </Button>
                    </ul>
                ) : (
                    <div>Welcome {sessionInfo.name}</div>
                )}
            </nav> */}
        </header>
    );
}
