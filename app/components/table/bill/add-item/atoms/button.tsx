export default function AddItemButton({
    setIsAdding,
}: {
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <button
            className="col-span-3 border border-black/10 bg-slate-200 py-0.5 text-center text-sm underline hover:bg-slate-300"
            onClick={() => setIsAdding((prev) => !prev)}
        >
            + Add Item +
        </button>
    );
}
