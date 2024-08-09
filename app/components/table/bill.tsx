import { useOutletContext } from "@remix-run/react";
import { TableContextType } from "~/routes/$code";

export default function Bill() {
    const { data: table } = useOutletContext<TableContextType>();
    if (!table) {
        return null;
    }
    const total =
        table.items.reduce((acc, item) => acc + item.price * 100, 0) / 100;
    // const userTotal = table.items.map((item) => {
    //     item.guests
    // });
    return (
        <div className="h-full grow drop-shadow-2xl">
            <div className="reciept h-full border bg-white p-6 py-12 shadow-2xl">
                <h2 className="mb-3 text-xl font-semibold">Bill</h2>
                <div className="flex-col gap-4">
                    {table.items.length > 0 ? (
                        table.items.map((item) => (
                            <div
                                key={item.name}
                                className="flex justify-between gap-20 border-b-2 border-dotted"
                            >
                                <span>{item.name}</span>
                                <span>${item.price}</span>
                            </div>
                        ))
                    ) : (
                        <div>No items</div>
                    )}
                </div>
                <div className="mt-4 border-b-4 border-t-4 border-dotted border-black/15 p-2">
                    <div className="flex justify-between">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Your Total</span>
                        <span>${total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
