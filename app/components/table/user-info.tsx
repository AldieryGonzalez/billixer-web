import { Check } from "lucide-react";
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
