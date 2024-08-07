import {
    unstable_useControl as useControl,
    type FieldMetadata,
} from "@conform-to/react";
import { ComponentProps, useRef, type ElementRef } from "react";
import { cn } from "~/lib/utils";
import { Switch } from "../ui/switch";

export function SwitchConform({
    meta,
    className,
    ...props
}: { meta: FieldMetadata<boolean> } & ComponentProps<typeof Switch>) {
    const switchRef = useRef<ElementRef<typeof Switch>>(null);
    const control = useControl(meta);

    return (
        <>
            <input
                name={meta.name}
                ref={control.register}
                defaultValue={meta.initialValue}
                className="sr-only"
                tabIndex={-1}
                onFocus={() => {
                    switchRef.current?.focus();
                }}
            />
            <Switch
                {...props}
                key={props.key}
                ref={switchRef}
                checked={meta.value === "on"}
                onCheckedChange={(checked) => {
                    control.change(checked ? "on" : "");
                }}
                onBlur={control.blur}
                className={cn(
                    "focus:ring-2 focus:ring-stone-950 focus:ring-offset-2",
                    className,
                )}
            />
        </>
    );
}
