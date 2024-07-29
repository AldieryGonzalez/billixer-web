import { doc, Firestore, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

type TableData = {
    title: string;
    date: Timestamp;
    description: string;
    confirmed: boolean;
    active: boolean;
    hasWaitlist: boolean;
    waitlist: string[];
    items: TableItem[];
    guests: Record<string, TableUser>;
};

type TableUser = {
    name: string;
    confirmed: boolean;
    paid: boolean;
    cardholder: string;
};
type TableItem = {
    mods: string;
    name: string;
    price: number;
    quantity: number;
    guests: string[];
};

export type TableSubscription = TableData & {
    code: string;
};

export function useTable(db: Firestore, code: string) {
    const [data, setData] = useState<TableSubscription>();
    const [error, setError] = useState<Error>();

    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, "tables", code),
            (doc) => {
                const data = doc.data() as TableData | undefined;
                if (!data) {
                    setError(new Error("Table not found"));
                    return;
                }

                setData({ ...data, code: doc.id });
            },
            (error) => {
                console.error("Error fetching table:", error);
                setError(error);
            },
        );

        return unsub;
    }, [db, code]);

    return { data, error };
}
