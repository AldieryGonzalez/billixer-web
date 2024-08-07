import { Label } from "@radix-ui/react-label";
import { ComponentProps } from "react";
import { Field, FieldError } from "../../conform/fields";
import { SwitchConform } from "../../conform/switch";

export const FormSwitch = ({
    meta,
    label,
}: {
    label: string;
} & ComponentProps<typeof SwitchConform>) => {
    const required = meta.required ? (
        <sup className="text-red-600">*</sup>
    ) : null;
    return (
        <Field className="my-2">
            <div className="flex items-center gap-2">
                <Label htmlFor={meta.id}>
                    {label}
                    {required}
                </Label>
                <SwitchConform meta={meta} />
            </div>
            {meta.errors && <FieldError>{meta.errors}</FieldError>}
        </Field>
    );
};
