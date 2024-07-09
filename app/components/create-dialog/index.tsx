import { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import CreateForm, { CreateTableFormT } from "./atoms/form";

export default function CreateDialog({
  action,
}: {
  action: (
    form: CreateTableFormT,
  ) => Promise<PostgrestSingleResponse<unknown[]>>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mt-4 w-full rounded-md bg-jonquil p-2 font-semibold"
        >
          Create table
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Table</DialogTitle>
          <DialogDescription>
            Name and configure the table here. Settings cannot be changed later.
          </DialogDescription>
        </DialogHeader>
        <CreateForm action={action} />
      </DialogContent>
    </Dialog>
  );
}
