import large from "~/assets/google-lg.png";
import small from "~/assets/google-sm.png";

export function GoogleButton(
    props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
    return (
        <>
            <button {...props} className="hidden md:block">
                <img className="h-9" src={large} alt="Continue with Google" />
                <span className="sr-only">Continue with Google</span>
            </button>
            <button {...props} className="md:hidden">
                <img className="h-9" src={small} alt="Continue with Google" />
            </button>
        </>
    );
}
