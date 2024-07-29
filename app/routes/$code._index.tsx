import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { ArrowRightCircle } from "lucide-react";
import { TableContextType } from "./$code";

import { useOutletContext } from "@remix-run/react";
import { useMemo } from "react";

export default function Index() {
    const { data, session } = useOutletContext() as TableContextType;
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
                <Users table={data} user={session} />
                <Bill table={data} />
            </div>
        </div>
    );
}

function Bill({ table }: { table: TableContextType["data"] }) {
    return (
        <div className="drop-shadow-2xl">
            <div className="reciept border bg-white p-6 py-12 shadow-2xl">
                <h2 className="mb-3 text-xl font-semibold">Bill</h2>
                <div className="flex-col gap-4">
                    {table.items.map((item) => (
                        <div
                            key={item.name}
                            className="flex justify-between gap-20 border-b-2 border-dotted"
                        >
                            <span>{item.name}</span>
                            <span>${item.price}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Users({
    table,
    user,
}: {
    table: TableContextType["data"];
    user: TableContextType["session"];
}) {
    const tableUsers = Object.entries(table.guests).map(([uid, guest]) => {
        return {
            ...guest,
            cardholderInfo: table.guests[guest.cardholder],
            uid: uid,
        };
    });
    console.log("Table Users", tableUsers);
    console.log("Authed User", user);
    const otherUsers = tableUsers.filter((u) => u.uid !== user.uid);
    const currentUser = tableUsers.find((u) => u.uid === user.uid);
    return (
        <div className="grow flex-col rounded-xl bg-jonquil p-4 md:max-w-screen-sm">
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Users</h2>
                <button>
                    <ArrowRightCircle />
                </button>
            </div>
            {/* Current User */}
            <div className="flex flex-col gap-3">
                {currentUser && (
                    <div className="flex items-center justify-between gap-20 rounded border-2 border-black/15 bg-background/85 p-3 shadow-md">
                        <div className="flex items-center gap-2">
                            <Avatar name={currentUser.name} />
                            <span className="font-bold">{`${currentUser.name} (Me)`}</span>
                        </div>
                        <span>{currentUser.confirmed ? "✅" : "❌"}</span>
                    </div>
                )}
                {/* Rest of Users */}
                <div className="flex max-h-64 w-full flex-wrap gap-3 overflow-hidden">
                    {otherUsers.map((user) => (
                        <div
                            key={user.name}
                            className="flex min-w-24 grow flex-col items-center gap-2 rounded bg-background/85 p-3"
                        >
                            <Avatar name={user.name} />
                            <span>{user.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Avatar({ name }: { name: string }) {
    const avatar = useMemo(() => {
        return createAvatar(thumbs, {
            size: 32,
            seed: name,
        }).toDataUri();
    }, [name]);
    return (
        <img
            className="rounded-full border-2 border-black/15"
            src={avatar}
            alt={name}
        />
    );
}
