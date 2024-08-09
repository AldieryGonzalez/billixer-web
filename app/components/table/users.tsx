import { useOutletContext } from "@remix-run/react";
import { ArrowLeftCircle, ArrowRightCircle, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import { TableContextType } from "~/routes/$code";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import Avatar from "./avatar";

const useWindowSize = () => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    if (width >= 1024) {
        return 20;
    } else if (width >= 640) {
        return 11;
    } else {
        return 8;
    }
};

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
    const usersPerPage = useWindowSize();
    // const mockUsers = Array.from({ length: 40 }, (_, i) => ({
    //     uid: `${i}`,
    //     name: `${i}`,
    // }));
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
type TableUser = {
    shortName: string;
    cardholderInfo: TableContextType["data"]["guests"][""];
    uid: string;
    name: string;
    confirmed: boolean;
    paid: boolean;
    cardholder: string;
};
type UserInfoProps = {
    selectedUser: TableUser;
    tableUsers: TableUser[];
    isSelectedUser: boolean;
};

function UserInfo({ selectedUser, isSelectedUser, tableUsers }: UserInfoProps) {
    return (
        <>
            <div className="flex h-full flex-col items-stretch gap-3">
                <p className="text-center text-sm font-bold md:text-lg">{`${selectedUser.name}${isSelectedUser ? " (Me)" : ""}`}</p>
                <div className="flex justify-around gap-2">
                    <span className="font-bold">${"1,123.45"}</span>
                    {isSelectedUser && (
                        <>
                            {selectedUser.confirmed ? (
                                <button className="rounded-full border-2 border-green-500/15 bg-green-600/55 p-1 shadow-inner">
                                    <Check size={14} />
                                </button>
                            ) : (
                                <button className="rounded-full border-2 border-black/55 bg-red-500/25 p-1 shadow-md shadow-black/25">
                                    <Check size={14} />
                                </button>
                            )}
                        </>
                    )}
                </div>
                <div className="mt-auto rounded-md border-2 border-black/15 bg-background bg-white p-1.5 shadow-md">
                    <p>Paying: </p>
                    {isSelectedUser ? (
                        <Select defaultValue={selectedUser.cardholder}>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        selectedUser.cardholderInfo.name
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {tableUsers.map((user) => (
                                    <SelectItem key={user.uid} value={user.uid}>
                                        {user.shortName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <p className="justify-end text-center">
                            {selectedUser.cardholderInfo.name}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
