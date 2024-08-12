import { useOutletContext } from "@remix-run/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useTableItems } from "~/hooks/useTableItems";
import { TableContextType } from "~/routes/$code";
import AddItem from "./add-item/add-item";
import Item from "./item/item";

export const ItemSchema = z.object({
    quantity: z
        .number()
        .int({ message: "Must input a whole number" })
        .positive("QTY must be positive"),
    item: z.string().trim().min(1, { message: "Must input a name" }),
    price: z
        .number()
        .positive()
        .refine(
            (v) =>
                v.toString().includes(".") &&
                v.toString().split(".")[1].length === 2,
            { message: "Price must be in the format xx.xx" },
        ),
});
export type ItemSchemaT = z.infer<typeof ItemSchema>;

export default function Bill() {
    const { data: table, selectedUserID } =
        useOutletContext<TableContextType>();
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const tableItems = useTableItems(table);
    const selectedUser = selectedUserID
        ? table.guests[selectedUserID]
        : { name: "Table" };
    const currentItems = selectedUserID
        ? tableItems.filter(({ guests }) => guests.includes(selectedUserID))
        : tableItems;
    const total = (
        currentItems.reduce((acc, item) => acc + item.price * 100, 0) / 100
    ).toFixed(2);
    return (
        <div className="h-full w-full drop-shadow-xl lg:w-1/3">
            <div className="reciept relative h-full border bg-white p-6 py-7 shadow-2xl">
                <h2 className="text-center text-lg font-semibold">
                    {`${selectedUser.name}'s`} Bill
                </h2>
                <button
                    className="absolute right-6 top-8 flex items-center justify-center rounded-full border-2 border-black/70 bg-jonquil/20 p-1 hover:bg-jonquil"
                    onClick={() => setIsEditing((prev) => !prev)}
                >
                    <Pencil size={16} strokeWidth={2} fill="#FFFFFF" />
                </button>
                <p className="text-center">{`$${total}`}</p>
                <div className="grid grid-cols-[4ch_1fr_6ch_min-content_min-content] items-center gap-1 border-b-2 border-dashed border-black/40 pb-2 pt-1">
                    <div className="col-span-3 grid grid-cols-subgrid border-b-2 border-dashed border-black/40">
                        <span className="text-xs">Qty</span>
                        <span className="text-xs">Item</span>
                        <span className="text-xs">Price</span>
                    </div>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, i) => (
                            <Item
                                item={item}
                                isEditing={isEditing}
                                key={`${item.name}${i}`}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 grid grid-cols-subgrid">
                            <span>xx</span>
                            <span>No items</span>
                            <span>xx.xx</span>
                        </div>
                    )}
                    <AddItem
                        isAdding={isAddingItem}
                        isEditing={isEditing}
                        setIsAdding={setIsAddingItem}
                    />
                </div>
                <div className="border-b-2 border-dashed border-black/40 p-2">
                    <div className="flex justify-between">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
