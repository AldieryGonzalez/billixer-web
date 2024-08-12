import { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { TableContextType } from "./$code";

import Bill from "~/components/table/bill/bill";
import Users from "~/components/table/users";

export const meta: MetaFunction = () => {
    return [
        { title: "Billixer" },
        { name: "description", content: "App for splitting checks and bills" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
    ];
};

// export const useTable = () => {
//     const context = useOutletContext<TableContextType>();
//     if (!context.data) {
//         throw new Error("useTable must be used within a TableContext");
//     }
//     return context;
// };

export default function Index() {
    const { data } = useOutletContext<TableContextType>();

    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex flex-col justify-between gap-3 py-4 lg:flex-row">
                <section className="mx-6 text-center md:text-left">
                    <h1 className="text-xl font-semibold md:text-3xl">
                        {data.title}
                    </h1>
                    <p className="">{data.description}</p>
                </section>
                <div className="flex justify-stretch gap-3 px-3">
                    <button className="grow rounded-md border-2 border-black/5 bg-jonquil p-2 shadow hover:bg-jonquil/50">
                        Invite Friends
                    </button>
                    <button className="grow rounded-md border-2 border-black/5 bg-jonquil p-2 shadow hover:bg-jonquil/50">
                        Table Settings
                    </button>
                </div>
            </div>
            <div className="flex h-full w-full flex-col justify-between gap-10 lg:flex-row lg:px-8">
                <Users />
                <Bill />
            </div>
        </div>
    );
}
