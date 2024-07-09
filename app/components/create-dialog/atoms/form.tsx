import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import FormInput from "./input-form";
import SwitchInput from "./switch-form";

export const FormSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  waitingRoom: z.boolean().default(false),
});

export type CreateTableFormT = z.infer<typeof FormSchema>;

function CreateForm({
  action,
}: {
  action: (
    form: CreateTableFormT,
  ) => Promise<PostgrestSingleResponse<unknown[]>>;
}) {
  const navigation = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      waitingRoom: false,
    },
  });

  async function onSubmit() {
    const res = await action(form.getValues());
    if (res.error) {
      console.error(res);
      return toast.error(`Error: ${res.error.message}`);
    }
    toast("Table Created Successfully!");
    navigation("/table");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <div className="space-y-4">
            <FormInput
              form={form}
              name="name"
              label="Name"
              placeholder="Your name"
            />
            <FormInput
              form={form}
              name="title"
              label="Title"
              placeholder="Table name"
            />
            <FormInput
              form={form}
              name="description"
              label="Description"
              placeholder="Event Description"
            />
            <SwitchInput
              form={form}
              name="waitingRoom"
              label="Enable waiting room"
              description="Allow people to join the table only after you approve them."
            />
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default CreateForm;
