import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

export default function CreateDialog() {
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
          <h2>Dialog Title</h2>
        </DialogHeader>
        <h2>Dialog Content</h2>
        <p>This is the dialog content.</p>
      </DialogContent>
    </Dialog>
  );
}
