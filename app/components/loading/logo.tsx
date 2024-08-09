import SvgComponent from "../icons/logo";

export function LoadingBillixer() {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <SvgComponent className="h-36 w-36 animate-bounce" />
        </div>
    );
}
