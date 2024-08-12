import { useMemo } from "react";
import { TableContextType } from "~/routes/$code";

export function useTableGuests(table: TableContextType["data"]) {
    return useMemo(
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
}
