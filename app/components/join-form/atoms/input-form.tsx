import React from "react";
import { UseFormReturn } from "react-hook-form"; // Assuming you are using react-hook-form
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { FormSchema } from "../form";

interface FormInputProps {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  name: Extract<keyof z.infer<typeof FormSchema>, string>;
  placeholder: string;
  label: string;
  description?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  form,
  name,
  label,
  placeholder,
  description,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              value={field.value as string}
              className="mt-2 w-full rounded-md border p-2"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
