import { useOutletContext } from "@remix-run/react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useMemo, useState } from "react";
import useWindowSize from "~/hooks/useWindowSize";
import { cn } from "~/lib/utils";
import { TableContextType } from "~/routes/$code";
import { Button } from "../ui/button";
import Avatar from "./avatar";
import UserInfo from "./user-info";

export default function Users() {
    const {
        data: table,
        session: { uid: sessionUID },
        selectedUserID,
        setSelectedUserID,
    } = useOutletContext<TableContextType>();
    const [page, setPage] = useState(0);
    const tableUsers = useMemo(
        () =>
            Object.entries(table.guests)
                .map(([uid, guest]) => {
                    const parts = guest.name.split(" ");
                    const firstName = parts[0];
                    const initials = parts
                        .slice(1)
                        .map((part) => part.charAt(0).toUpperCase() + ".");
                    const shortName = [firstName, ...initials].join(" ");
                    return {
                        ...guest,
                        shortName,
                        cardholderInfo: table.guests[guest.cardholder],
                        uid: uid,
                    };
                })
                .sort((a, b) => a.name.localeCompare(b.name)),
        [table.guests],
    );
    const width = useWindowSize();
    const usersPerPage = width >= 1024 ? 20 : width >= 640 ? 11 : 8;
    const pagedUsers = tableUsers.slice(
        page * usersPerPage,
        page * usersPerPage + usersPerPage,
    );
    const selectedUser = tableUsers.find((u) => u.uid === selectedUserID);
    const isSelectedUser = sessionUID === selectedUserID;
    const maxPage = Math.ceil(tableUsers.length / usersPerPage) - 1;
    const handleNextPage = () => setPage((p) => Math.min(p + 1, maxPage));
    const handlePrevPage = () => setPage((p) => Math.max(p - 1, 0));
    return (
        <div className="h-fit grow-[2] flex-col bg-jonquil p-4 shadow-xl lg:rounded-md">
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Users</h2>
                <div className="flex gap-2">
                    <Button onClick={handlePrevPage} disabled={page <= 0}>
                        <ArrowLeftCircle />
                    </Button>
                    <Button onClick={handleNextPage} disabled={page >= maxPage}>
                        <ArrowRightCircle />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-4 grid-rows-2 gap-1 sm:grid-cols-5 lg:grid-cols-6">
                {/* Current User */}
                <div className="col-span-2 row-span-2 rounded-md border-2 bg-background p-2 shadow">
                    {selectedUser ? (
                        <UserInfo
                            isSelectedUser={isSelectedUser}
                            selectedUser={selectedUser}
                            tableUsers={tableUsers}
                        />
                    ) : (
                        <>
                            <div className="flex flex-col items-center gap-2">
                                Table Total
                                <span className="font-bold">${"0"}</span>
                            </div>
                        </>
                    )}
                </div>
                {/* Rest of Users */}
                {pagedUsers.map((user) => (
                    <button
                        key={`empty-${user.name}`}
                        type="button"
                        onClick={() => {
                            if (user.uid === selectedUserID) {
                                setSelectedUserID(null);
                                return;
                            }
                            setSelectedUserID(user.uid);
                        }}
                        className={cn(
                            "flex grow flex-col items-center gap-2 rounded bg-background/85 p-1",
                            user.uid === selectedUserID &&
                                "border border-sky-500/25 bg-sky-100 shadow-inner shadow-black/25",
                        )}
                    >
                        <Avatar name={user.name} />
                        <span className="max-w-full break-words text-[10px] md:text-xs lg:text-base">
                            {user.shortName}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
