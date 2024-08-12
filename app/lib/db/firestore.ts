import {
    arrayRemove,
    arrayUnion,
    deleteField,
    doc,
    Firestore,
    onSnapshot,
    setDoc,
    Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTableItems } from "~/hooks/useTableItems";

export type TableData = {
    title: string;
    date: Timestamp;
    description: string;
    confirmed: boolean;
    active: boolean;
    hasWaitlist: boolean;
    waitlist: string[];
    items: Record<string, TableItem>;
    admin: string[];
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

type ClientTableItem = ReturnType<typeof useTableItems>[0];

export async function toggleClaimItem(
    db: Firestore,
    uid: string,
    code: string,
    item: ClientTableItem,
) {
    const included = item.guests.includes(uid);
    const docRef = doc(db, "tables", code);
    try {
        if (included) {
            await setDoc(
                docRef,
                { items: { [item.uid]: { guests: arrayRemove(uid) } } },
                { merge: true },
            );
        } else {
            await setDoc(
                docRef,
                { items: { [item.uid]: { guests: arrayUnion(uid) } } },
                { merge: true },
            );
        }
    } catch (e) {
        console.error("Error claiming item:", e);
    }
}

export async function addTableItem(
    db: Firestore,
    code: string,
    newItem: ClientTableItem,
    itemID: string,
) {
    const docRef = doc(db, "tables", code);
    await setDoc(
        docRef,
        {
            items: { [itemID]: newItem },
        },
        { merge: true },
    );
}

export async function removeTableItem(
    db: Firestore,
    code: string,
    itemID: string,
) {
    const docRef = doc(db, "tables", code);
    await setDoc(
        docRef,
        {
            items: { [itemID]: deleteField() },
        },
        { merge: true },
    );
}

export async function updateTableItem(
    db: Firestore,
    code: string,
    item: TableItem,
    itemID: string,
) {
    const docRef = doc(db, "tables", code);
    await setDoc(
        docRef,
        {
            items: { [itemID]: item },
        },
        { merge: true },
    );
}

export async function toggleConfirmUser(
    db: Firestore,
    code: string,
    uid: string,
    confirmed: boolean,
) {
    const docRef = doc(db, "tables", code);
    await setDoc(
        docRef,
        {
            guests: {
                [uid]: { confirmed },
            },
        },
        { merge: true },
    );
}
