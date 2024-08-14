import { useOutletContext } from "@remix-run/react";
import { Check } from "lucide-react";
import { useTableItems } from "~/hooks/useTableItems";
import { toggleConfirmUser } from "~/lib/db/firestore";
import { useFirebase } from "~/lib/firebase";
import { cn } from "~/lib/utils";
import { TableContextType } from "~/routes/$code";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

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

export default function UserInfo({
    selectedUser,
    isSelectedUser,
    tableUsers,
}: UserInfoProps) {
    const { db } = useFirebase();
    const { data: table } = useOutletContext<TableContextType>();
    const tableItems = useTableItems(table).filter((item) =>
        item.guests.includes(selectedUser.uid),
    );
    const total = tableItems.reduce((acc, item) => acc + item.price, 0);
    return (
        <>
            <div className="flex h-full flex-col items-stretch gap-3">
                <p className="text-center text-sm font-bold md:text-lg">{`${selectedUser.name}${isSelectedUser ? " (Me)" : ""}`}</p>
                <div className="flex justify-around gap-2">
                    <span className="font-bold">${total}</span>
                    {isSelectedUser && (
                        <button
                            onClick={async () =>
                                await toggleConfirmUser(
                                    db,
                                    table.code,
                                    selectedUser.uid,
                                    !selectedUser.confirmed,
                                )
                            }
                            className={cn(
                                "rounded-full border-2 p-1",
                                selectedUser.confirmed
                                    ? "border-green-500/15 bg-green-600/55 shadow-inner"
                                    : "border-black/55 bg-red-500/25 shadow-md shadow-black/25",
                            )}
                        >
                            <Check size={14} />
                        </button>
                    )}
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-center rounded-md border-2 border-black/15 bg-background bg-white p-0.5 shadow-md">
                    <p className="px-1">Paying: </p>
                    {isSelectedUser ? (
                        <Select defaultValue={selectedUser.cardholder}>
                            <SelectTrigger className="h-6">
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
