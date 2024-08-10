import { useOutletContext } from "@remix-run/react";
import { useState } from "react";
import { TableContextType } from "~/routes/$code";

export default function Bill() {
    const { data: table } = useOutletContext<TableContextType>();
    const [addItem, setAddItem] = useState(false);

    if (!table) {
        return null;
    }
    const total =
        table.items.reduce((acc, item) => acc + item.price * 100, 0) / 100;
    return (
        <div className="h-full grow drop-shadow-2xl">
            <div className="reciept h-full border bg-white p-6 py-12 shadow-2xl">
                <div className="mb-3 flex items-center gap-4">
                    <h2 className="text-xl font-semibold">Bill</h2>
                    <button
                        className="flex size-5 items-center justify-center rounded-full border border-black/70"
                        onClick={() => setAddItem(!addItem)}
                    >
                        +
                    </button>
                </div>
                <div className="grid grid-cols-[min-content_1fr_min-content] gap-3">
                    <span className="text-xs">Qty</span>
                    <span className="text-xs">Item</span>
                    <span className="text-xs">Price</span>
                </div>
                <div className="grid grid-cols-[min-content_1fr_min-content] items-center gap-1 border-y-2 border-dashed border-black/40 pb-2 pt-1">
                    {addItem && (
                        <>
                            <span className="text-sm">{0}x </span>
                            <span>Adding Item</span>
                            <span className="justify-self-end">$0.99</span>
                        </>
                    )}
                    {table.items.length > 0 ? (
                        table.items.map((item, i) => (
                            <Item item={item} key={`${item.name}${i}`} />
                        ))
                    ) : (
                        <>
                            <span>XxX</span>
                            <span>No items</span>
                            <span>XxX</span>
                        </>
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
            <span className="text-sm">{item.quantity}x </span>
            <span>{item.name}</span>
            <span className="justify-self-end">${item.price}</span>
        </>
    );
}
