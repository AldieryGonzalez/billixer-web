import { redirect } from "@remix-run/node";
import { type CreateTableSchemaT } from "~/components/forms/create-form";
import { JoinTableSchemaT } from "~/components/forms/join-form";
import { checkSession } from "../auth/auth.server";
import { db } from "../firebase.server";
import { generateTableCode } from "../utils";
import { TableData } from "./firestore";

export const createTable = async (
    payload: CreateTableSchemaT,
    request: Request,
) => {
    const session = await checkSession(request);
    if (!session) {
        throw redirect("/", { status: 301, statusText: "Unauthorized" });
    }
    let tableId: string;
    let docExists: boolean;
    do {
        tableId = generateTableCode();
        const docRef = db.collection("tables").doc(tableId);
        const doc = await docRef.get();
        docExists = doc.exists;
    } while (docExists);

    const data = {
        active: true,
        admin: [session.uid],
        confirmed: false,
        date: new Date() as unknown as TableData["date"],
        description: payload.description || "",
        guests: {
            [session.uid]: {
                name: payload.name,
                confirmed: false,
                paid: false,
                cardholder: session.uid,
            },
        },
        hasWaitlist: payload.waitingRoom,
        items: [],
        title: payload.title,
        waitlist: [],
    } as TableData;
    await db.collection("tables").doc(tableId).set(data);
    return tableId;
};

export const joinTable = async (
    payload: JoinTableSchemaT,
    request: Request,
) => {
    const session = await checkSession(request);
    if (!session) {
        throw redirect("/", { status: 301, statusText: "Unauthorized" });
    }
    const docRef = db.collection("tables").doc(payload.tableCode);
    const doc = await docRef.get();
    if (!doc.exists) {
        throw new Error("Table not found");
    }
    const data = doc.data() as TableData;
    if (data.guests[session.uid]) {
        return await docRef.set(
            {
                guests: {
                    [session.uid]: {
                        name: payload.name,
                    },
                },
            },
            { merge: true },
        );
    }
    return await docRef.set(
        {
            guests: {
                [session.uid]: {
                    name: payload.name,
                    confirmed: false,
                    paid: false,
                    cardholder: session.uid,
                },
            },
        },
        { merge: true },
    );
};
