import { useOutletContext } from "@remix-run/react";
import { Trash2, Undo2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTableItems } from "~/hooks/useTableItems";
import { removeTableItem } from "~/lib/db/firestore";
import { useFirebase } from "~/lib/firebase";
import { TableContextType } from "~/routes/$code";

export default function DeleteItem({
    item,
    handleCancel,
}: {
    item: ReturnType<typeof useTableItems>[0];
    handleCancel: () => void;
}) {
    const { db } = useFirebase();
    const {
        data: { code },
    } = useOutletContext<TableContextType>();
    const handleDelete = () => {
        removeTableItem(db, code, item.uid);
        handleCancel();
    };

    return (
        <div className="col-span-5 grid h-7 grid-cols-subgrid items-center justify-center whitespace-nowrap px-2 text-sm">
            <span className="text-sm text-red-700 line-through">
                {item.quantity}
            </span>
            <span className="w-full truncate text-left text-red-700 line-through">
                {item.name}
            </span>
            <span className="items-end justify-self-end text-red-700 line-through">
                ${item.price}
            </span>

            <Button variant="outline" size="xs" onClick={handleCancel}>
                <Undo2 size={18} strokeWidth={2} />
            </Button>
            <Button variant="destructive" size="xs" onClick={handleDelete}>
                <Trash2 size={18} strokeWidth={2} />
            </Button>
        </div>
    );
}
