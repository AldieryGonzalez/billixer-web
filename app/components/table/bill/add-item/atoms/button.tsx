import { Button } from "~/components/ui/button";

export default function AddItemButton({
    setIsAdding,
}: {
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Button
            className="col-span-3 border border-black/10 bg-slate-200 text-center text-sm text-black underline hover:bg-slate-300"
            size="xs"
            onClick={() => setIsAdding((prev) => !prev)}
        >
            + Add Item +
        </Button>
    );
}
