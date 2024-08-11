import { useOutletContext } from "@remix-run/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { TableContextType } from "~/routes/$code";
import { Input } from "../ui/input";

export default function Bill() {
    const { data: table, selectedUserID } =
        useOutletContext<TableContextType>();
    const [addItem, setAddItem] = useState(false);

    if (!table) {
        return null;
    }
    const selectedUser = selectedUserID
        ? table.guests[selectedUserID]
        : { name: "Table" };
    const currentItems = selectedUserID
        ? table.items.filter(({ guests }) => guests.includes(selectedUserID))
        : table.items;
    const total = (
        currentItems.reduce((acc, item) => acc + item.price * 100, 0) / 100
    ).toFixed(2);
    return (
        <div className="h-full w-full drop-shadow-xl lg:w-1/3">
            <div className="reciept relative h-full border bg-white p-6 py-7 shadow-2xl">
                <h2 className="text-center text-lg font-semibold">
                    {`${selectedUser.name}'s`} Bill
                </h2>

                <button className="absolute right-6 top-8 flex items-center justify-center rounded-full border-2 border-black/70 bg-jonquil/20 p-1 hover:bg-jonquil">
                    <Pencil size={16} strokeWidth={2} fill="#FFFFFF" />
                </button>
                <p className="text-center">{`$${total}`}</p>

                <div className="grid grid-cols-[4ch_1fr_6ch] items-center gap-1 border-b-2 border-dashed border-black/40 pb-2 pt-1">
                    <div className="contents bg-black">
                        <span className="text-xs">Qty</span>
                        <span className="text-xs">Item</span>
                        <span className="text-xs">Price</span>
                    </div>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, i) => (
                            <Item item={item} key={`${item.name}${i}`} />
                        ))
                    ) : (
                        <>
                            <span>xx</span>
                            <span>No items</span>
                            <span>XXxX</span>
                        </>
                    )}
                    {addItem && (
                        <>
                            {/* <span className="text-sm">{11}</span>
                            <span>Adding Itemssssssss</span>
                            <span className="justify-self-end">$0.99</span> */}
                            <Input
                                className="h-8 border px-1 py-0.5"
                                placeholder="QTY"
                            />
                            <Input
                                className="h-8 w-full border px-1"
                                placeholder="Name"
                            />
                            <Input
                                className="h-8 border px-1"
                                placeholder="Price"
                            />
                        </>
                    )}
                    {addItem ? (
                        <div className="col-span-3 flex">
                            <button
                                className="w-1/2 border border-black/10 bg-slate-200 py-0.5 text-center text-sm hover:bg-slate-300"
                                onClick={() => 1}
                            >
                                ✅
                            </button>
                            <button
                                className="w-1/2 border border-black/10 bg-slate-200 py-0.5 text-center text-sm hover:bg-slate-300"
                                onClick={() => setAddItem(!addItem)}
                            >
                                ❌
                            </button>
                        </div>
                    ) : (
                        <button
                            className="col-span-3 border border-black/10 bg-slate-200 py-0.5 text-center text-sm underline hover:bg-slate-300"
                            onClick={() => setAddItem(!addItem)}
                        >
                            + Add Item +
                        </button>
                    )}
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

function Item({ item }: { item: TableContextType["data"]["items"][0] }) {
    return (
        <>
            <span className="text-sm">{item.quantity}</span>
            <span>{item.name}</span>
            <span className="justify-self-end">${item.price}</span>
        </>
    );
}
