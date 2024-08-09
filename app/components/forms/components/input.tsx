import { FieldMetadata } from "@conform-to/react";
import { ComponentProps } from "react";
import { Input } from "~/components/ui/input";
import { Field, FieldError } from "../../conform/fields";
import { InputConform } from "../../conform/input";
import { Label } from "../../ui/label";

export const FormInput = ({
    meta,
    label,
    placeholder = label,
    ...props
}: {
    meta: FieldMetadata<string>;
    label: string;
} & ComponentProps<typeof Input>) => {
    const required = meta.required ? (
        <sup className="text-red-600">*</sup>
    ) : null;
    return (
        <Field className="mt-0.5">
            <Label htmlFor={meta.id}>
                {label}
                {required}
            </Label>
            <InputConform
                {...props}
                meta={meta}
                type="text"
                placeholder={placeholder}
                className="text-base"
            />
            {meta.errors && <FieldError>{meta.errors[0]}</FieldError>}
        </Field>
    );
};
