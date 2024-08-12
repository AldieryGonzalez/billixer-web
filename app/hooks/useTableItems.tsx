import { useMemo } from "react";
import { TableContextType } from "~/routes/$code";

export function useTableItems(table: TableContextType["data"]) {
    return useMemo(
        () =>
            Object.entries(table.items)
                .map(([id, item]) => {
                    return {
                        ...item,
                        uid: id,
                    };
                })
                .sort((a, b) => a.name.localeCompare(b.name)),
        [table.items],
    );
}
