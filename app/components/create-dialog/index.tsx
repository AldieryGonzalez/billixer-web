import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import CreateForm from "../forms/create-form";

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
                    <DialogTitle>Create a Table</DialogTitle>
                    <DialogDescription>
                        Name and configure the table here. Settings cannot be
                        changed later.
                    </DialogDescription>
                </DialogHeader>
                <CreateForm />
            </DialogContent>
        </Dialog>
    );
}
