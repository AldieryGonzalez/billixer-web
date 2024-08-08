import { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { TableContextType } from "./$code";

import Bill from "~/components/table/bill";
import Users from "~/components/table/users";

export const meta: MetaFunction = () => {
    return [
        { title: "Billixer" },
        { name: "description", content: "App for splitting checks and bills" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
    ];
};

export const useTable = () => {
    const context = useOutletContext() as TableContextType;
    if (!context.data) {
        throw new Error("useTable must be used within a TableContext");
    }
    return context;
};

export default function Index() {
    const { data } = useOutletContext() as TableContextType;

    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h1 className="text-3xl">{data.title}</h1>
                <button className="rounded-md border-2 border-black/5 bg-jonquil p-2 shadow hover:bg-jonquil/50">
                    Table Settings
                </button>
            </div>
            <p className="mb-6">{data.description}</p>
            <div className="flex w-full flex-col justify-between gap-10 md:flex-row">
                <Users />
                <Bill />
            </div>
        </div>
    );
}
