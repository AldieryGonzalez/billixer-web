import { GoogleIcon } from "../icons/google";

export function GoogleButton() {
    return (
        <button className="gsi-material-button">
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                    <GoogleIcon />
                </div>
                <span className="sr-only">Continue with Google</span>
            </div>
        </button>
    );
}
