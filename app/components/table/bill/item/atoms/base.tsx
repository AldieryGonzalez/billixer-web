import { useOutletContext } from "@remix-run/react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTableItems } from "~/hooks/useTableItems";
import { toggleClaimItem } from "~/lib/db/firestore";
import { useFirebase } from "~/lib/firebase";
import { cn } from "~/lib/utils";
import { TableContextType } from "~/routes/$code";

export default function BaseItem({
    item,
    isEditing,
    handleSetEdit,
    handleSetDelete,
}: {
    item: ReturnType<typeof useTableItems>[0];
    isEditing: boolean;
    handleSetEdit: () => void;
    handleSetDelete: () => void;
}) {
    const { data, session } = useOutletContext<TableContextType>();
    const { db } = useFirebase();
    const isClaimed = item.guests.includes(session.uid);
    return (
        <>
            <Button
                size="xs"
                variant="item"
                className={cn(
                    "col-span-3 grid grid-cols-subgrid",
                    isClaimed && "bg-jonquil/70",
                )}
                onClick={() =>
                    toggleClaimItem(db, session.uid, data.code, item)
                }
                disabled={isEditing}
            >
                <span className="justify-self-start text-sm">
                    {item.quantity}
                </span>
                <span className="w-full truncate text-left">{item.name}</span>
                <span className="items-end justify-self-end">
                    ${item.price.toFixed(2)}
                </span>
            </Button>
            {isEditing && (
                <>
                    <Button
                        size="xs"
                        variant="outline"
                        className="text-xs"
                        onClick={handleSetEdit}
                    >
                        <Pencil
                            strokeWidth={1}
                            size={18}
                            fill="hsl(var(--jonquil))"
                        />
                    </Button>
                    <Button
                        size="xs"
                        variant="destructive"
                        className="text-xs"
                        onClick={handleSetDelete}
                    >
                        <Trash2 size={18} />
                    </Button>
                </>
            )}
        </>
    );
}
