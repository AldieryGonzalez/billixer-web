import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useOutletContext } from "@remix-run/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useFirebase } from "~/contexts/firebase";
import { addTableItem } from "~/lib/db/firestore";
import { TableContextType } from "~/routes/$code";
import { InputConform as Input } from "../conform/input";
import { Button } from "../ui/button";

const AddItemSchema = z.object({
    quantity: z
        .number()
        .int({ message: "Must input a whole number" })
        .positive("QTY must be positive"),
    item: z.string().trim().min(1, { message: "Must input a name" }),
    price: z
        .number()
        .positive()
        .refine(
            (v) =>
                v.toString().includes(".") &&
                v.toString().split(".")[1].length === 2,
            { message: "Price must be in the format xx.xx" },
        ),
});
type AddItemSchemaT = z.infer<typeof AddItemSchema>;

export default function Bill() {
    const { data: table, selectedUserID } =
        useOutletContext<TableContextType>();
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const selectedUser = selectedUserID
        ? table.guests[selectedUserID]
        : { name: "Table" };
    const currentItems = selectedUserID
        ? table.items.filter(({ guests }) => guests.includes(selectedUserID))
        : table.items;
    const total = (
        currentItems.reduce((acc, item) => acc + item.price * 100, 0) / 100
    ).toFixed(2);
    return (
        <div className="h-full w-full drop-shadow-xl lg:w-1/3">
            <div className="reciept relative h-full border bg-white p-6 py-7 shadow-2xl">
                <h2 className="text-center text-lg font-semibold">
                    {`${selectedUser.name}'s`} Bill
                </h2>

                <button
                    className="absolute right-6 top-8 flex items-center justify-center rounded-full border-2 border-black/70 bg-jonquil/20 p-1 hover:bg-jonquil"
                    onClick={() => setIsEditing((prev) => !prev)}
                >
                    <Pencil size={16} strokeWidth={2} fill="#FFFFFF" />
                </button>
                <p className="text-center">{`$${total}`}</p>

                <div className="grid grid-cols-[4ch_1fr_6ch_min-content_min-content] items-center gap-1 border-b-2 border-dashed border-black/40 pb-2 pt-1">
                    <div className="col-span-3 grid grid-cols-subgrid border-b-2 border-dashed border-black/40">
                        <span className="text-xs">Qty</span>
                        <span className="text-xs">Item</span>
                        <span className="text-xs">Price</span>
                    </div>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, i) => (
                            <Item
                                item={item}
                                isEditing={isEditing}
                                key={`${item.name}${i}`}
                            />
                        ))
                    ) : (
                        <>
                            <span>xx</span>
                            <span>No items</span>
                            <span>xx.xx</span>
                        </>
                    )}
                    <AddItem
                        isAdding={isAddingItem}
                        setIsAdding={setIsAddingItem}
                    />
                </div>
                <div className="border-b-2 border-dashed border-black/40 p-2">
                    <div className="flex justify-between">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Item({
    item,
    isEditing,
}: {
    item: TableContextType["data"]["items"][0];
    isEditing: boolean;
}) {
    return (
        <>
            <Button
                size="xs"
                variant="item"
                className="col-span-3 grid grid-cols-subgrid"
            >
                <span className="justify-self-start text-sm">
                    {item.quantity}
                </span>
                <span className="items-start justify-self-start">
                    {item.name}
                </span>
                <span className="items-end justify-self-end">
                    ${item.price}
                </span>
            </Button>
            {isEditing && (
                <>
                    <Button size="xs" variant="secondary" className="text-xs">
                        e
                    </Button>
                    <Button size="xs" variant="destructive" className="text-xs">
                        d
                    </Button>
                </>
            )}
        </>
    );
}

function AddItem({
    isAdding,
    setIsAdding,
}: {
    isAdding: boolean;
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <>
            {isAdding ? (
                <AddItemForm setIsAdding={setIsAdding} />
            ) : (
                <AddItemButton setIsAdding={setIsAdding} />
            )}
        </>
    );
}

function AddItemForm({
    setIsAdding,
}: {
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { db } = useFirebase();
    const { data: table, selectedUserID } =
        useOutletContext<TableContextType>();
    const [form, fields] = useForm<AddItemSchemaT>({
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: AddItemSchema });
        },
        onSubmit(e, { submission }) {
            e.preventDefault();
            if (submission && submission.status === "success") {
                toast.promise(
                    addTableItem(db, table.code, {
                        name: submission.value.item,
                        price: submission.value.price,
                        quantity: submission.value.quantity,
                        guests: selectedUserID ? [selectedUserID] : [],
                        mods: "",
                    }),
                    {
                        loading: "Adding item...",
                        success: "Item added",
                        error: "Error adding item",
                    },
                );
                setIsAdding((prev) => !prev);
            }
        },
    });
    return (
        <Form {...getFormProps(form)} className="contents">
            <Input
                type="number"
                meta={fields.quantity}
                className="h-8 border px-1"
                placeholder="QTY"
            />
            <Input
                type="text"
                meta={fields.item}
                className="h-8 w-full border px-1"
                placeholder="Item"
                autoComplete="off"
            />
            <Input
                type="number"
                meta={fields.price}
                className="h-8 border px-1"
                placeholder="Price"
            />
            <div className="col-span-3 flex">
                <button
                    className="w-1/2 border border-black/10 bg-slate-200 py-0.5 text-center text-sm hover:bg-slate-300"
                    type="submit"
                >
                    ✅
                </button>
                <button
                    className="w-1/2 border border-black/10 bg-slate-200 py-0.5 text-center text-sm hover:bg-slate-300"
                    onClick={() => {
                        setIsAdding((prev) => !prev);
                    }}
                >
                    ❌
                </button>
            </div>
        </Form>
    );
}

function AddItemButton({
    setIsAdding,
}: {
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <button
            className="col-span-3 border border-black/10 bg-slate-200 py-0.5 text-center text-sm underline hover:bg-slate-300"
            onClick={() => setIsAdding((prev) => !prev)}
        >
            + Add Item +
        </button>
    );
}
