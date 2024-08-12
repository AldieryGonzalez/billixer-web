import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useOutletContext } from "@remix-run/react";
import { toast } from "sonner";
import { InputConform as Input } from "~/components/conform/input";
import { Button } from "~/components/ui/button";
import { useFirebase } from "~/contexts/firebase";
import { addTableItem } from "~/lib/db/firestore";
import { TableContextType } from "~/routes/$code";
import { ItemSchema, ItemSchemaT } from "../../bill";

export default function AddItemForm({
    setIsAdding,
}: {
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { db } = useFirebase();
    const { data: table, selectedUserID } =
        useOutletContext<TableContextType>();
    const [form, fields] = useForm<ItemSchemaT>({
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: ItemSchema });
        },
        onSubmit(e, { submission }) {
            e.preventDefault();
            if (submission && submission.status === "success") {
                const newID =
                    Math.random().toString(36).substring(2, 15) +
                    Object.keys(table.items).length;
                toast.promise(
                    addTableItem(
                        db,
                        table.code,
                        {
                            name: submission.value.item,
                            price: submission.value.price,
                            quantity: submission.value.quantity,
                            guests: selectedUserID ? [selectedUserID] : [],
                            mods: "",
                        },
                        newID,
                    ),
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
        <Form
            {...getFormProps(form)}
            className="col-span-3 grid grid-cols-subgrid"
        >
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
            <div className="col-span-3 flex pt-1">
                <Button
                    className="w-1/2 rounded-r-none border border-black/10 bg-slate-200 py-0.5 text-center text-sm hover:bg-slate-300"
                    size="xs"
                    type="submit"
                >
                    ✅
                </Button>
                <Button
                    className="w-1/2 rounded-l-none border border-black/10 bg-slate-200 py-0.5 text-center text-sm hover:bg-slate-300"
                    size="xs"
                    type="reset"
                    onClick={() => {
                        form.reset();
                        setIsAdding((prev) => !prev);
                    }}
                >
                    ❌
                </Button>
            </div>
        </Form>
    );
}
