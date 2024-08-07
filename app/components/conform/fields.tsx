import { cn } from "~/lib/utils";

export const Field = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col gap-2", className)}>{children}</div>
    );
};

export const FieldError = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("text-xs text-red-600", className)}>{children}</div>
    );
};
