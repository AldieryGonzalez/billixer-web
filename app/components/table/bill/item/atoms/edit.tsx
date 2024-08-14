import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useOutletContext } from "@remix-run/react";
import { toast } from "sonner";
import { InputConform as Input } from "~/components/conform/input";
import { useTableItems } from "~/hooks/useTableItems";
import { updateTableItem } from "~/lib/db/firestore";
import { useFirebase } from "~/lib/firebase";
import { TableContextType } from "~/routes/$code";
import { ItemSchema, ItemSchemaT } from "../../bill";

export default function EditItem({
    item,
    handleCancel,
}: {
    item: ReturnType<typeof useTableItems>[0];
    handleCancel: () => void;
}) {
    const { db } = useFirebase();
    const { data: table, selectedUserID } =
        useOutletContext<TableContextType>();
    const [form, fields] = useForm<ItemSchemaT>({
        defaultValue: {
            item: item.name,
            price: item.price,
            quantity: item.quantity,
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: ItemSchema });
        },
        onSubmit(e, { submission }) {
            e.preventDefault();
            if (submission && submission.status === "success") {
                toast.promise(
                    updateTableItem(
                        db,
                        table.code,
                        {
                            name: submission.value.item,
                            price: submission.value.price,
                            quantity: submission.value.quantity,
                            guests: selectedUserID ? [selectedUserID] : [],
                            mods: "",
                        },
                        item.uid,
                    ),
                    {
                        loading: "Editing item...",
                        success: "Success!",
                        error: "Error adding item",
                    },
                );
                handleCancel();
            }
        },
    });
    return (
        <Form
            {...getFormProps(form)}
            className="col-span-5 grid grid-cols-subgrid"
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
            <button
                className="border border-black/10 bg-slate-200 py-0.5 text-center text-sm hover:bg-slate-300"
                type="submit"
            >
                ✅
            </button>
            <button
                className="border border-black/10 bg-slate-200 py-0.5 text-center text-sm hover:bg-slate-300"
                onClick={handleCancel}
                type="reset"
            >
                ❌
            </button>
        </Form>
    );
}
