import { LoaderCircle } from "lucide-react";

export function Spinner() {
    return (
        <div className="my-auto flex items-center justify-center">
            <LoaderCircle className="my-auto animate-spin" />
        </div>
    );
}
