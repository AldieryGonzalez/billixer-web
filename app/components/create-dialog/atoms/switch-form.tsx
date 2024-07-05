import React from "react";
import { UseFormReturn } from "react-hook-form"; // Assuming you are using react-hook-form
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../../ui/form";
import { Switch } from "../../ui/switch";
import { FormSchema } from "./form";

interface SwitchInputProps {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  name: Extract<keyof z.infer<typeof FormSchema>, string>;
  label: string;
  description: string;
}

const SwitchInput: React.FC<SwitchInputProps> = ({
  form,
  name,
  label,
  description,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-white p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={!!field.value}
              onCheckedChange={field.onChange}
              className="data-[state=unchecked]:bg-gray-300"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default SwitchInput;
