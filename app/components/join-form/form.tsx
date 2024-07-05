import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "../ui/form";
import FormInput from "./atoms/input-form";

export const FormSchema = z.object({
  tableCode: z.string().min(6),
  name: z.string().min(1),
});

export default function JoinForm() {
  const navigation = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit() {
    toast("Joined Table Successfully!");
    navigation("/table");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grow rounded-md border bg-white p-6 shadow-xl"
      >
        <h3 className="text-xl font-semibold">Join table</h3>
        <div className="space-y-4">
          <FormInput
            form={form}
            name="tableCode"
            label="Table Code"
            placeholder="Table Code (6 characters)"
          />
          <FormInput
            form={form}
            name="name"
            label="Name"
            placeholder="Your name"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-sky-500 p-2 text-white"
        >
          Join
        </button>
      </form>
    </Form>
  );
}
