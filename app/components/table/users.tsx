import { ArrowRightCircle } from "lucide-react";
import { useTable } from "~/routes/$code._index";
import Avatar from "./avatar";

export default function Users() {
    const { data: table, selectedUserID } = useTable();
    console.log(table);
    if (!table) {
        return null;
    }
    const tableUsers = Object.entries(table.guests).map(([uid, guest]) => {
        return {
            ...guest,
            cardholderInfo: table.guests[guest.cardholder],
            uid: uid,
        };
    });
    const otherUsers = tableUsers.filter((u) => u.uid !== selectedUserID);
    const selectedUser = tableUsers.find((u) => u.uid === selectedUserID);
    return (
        <div className="grow-[2] flex-col rounded-xl bg-jonquil p-4 md:max-w-screen-sm">
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Users</h2>
                <button>
                    <ArrowRightCircle />
                </button>
            </div>
            {/* Current User */}
            <div className="flex flex-col gap-3">
                {selectedUser && (
                    <div className="flex items-center justify-between gap-20 rounded border-2 border-black/15 bg-background/85 p-3 shadow-md">
                        <div className="flex items-center gap-2">
                            <Avatar name={selectedUser.name} />
                            <span className="font-bold">{`${selectedUser.name} (Me)`}</span>
                        </div>
                        <span>{selectedUser.confirmed ? "✅" : "❌"}</span>
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
