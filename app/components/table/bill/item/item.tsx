import { useState } from "react";
import { useTableItems } from "~/hooks/useTableItems";
import BaseItem from "./atoms/base";
import DeleteItem from "./atoms/delete";
import EditItem from "./atoms/edit";

export default function Item({
    item,
    isEditing,
}: {
    item: ReturnType<typeof useTableItems>[0];
    isEditing: boolean;
}) {
    const [edit, setEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const handleSetEdit = () => {
        setEdit(true);
        setDeleting(false);
    };
    const handleSetDelete = () => {
        setEdit(false);
        setDeleting(true);
    };
    const handleRemoveEdit = () => setEdit(false);
    const handleRemoveDelete = () => setDeleting(false);
    if (edit) return <EditItem item={item} removeEdit={handleRemoveEdit} />;
    if (deleting) return <DeleteItem removeDelete={handleRemoveDelete} />;
    return (
        <BaseItem
            item={item}
            isEditing={isEditing}
            handleSetDelete={handleSetDelete}
            handleSetEdit={handleSetEdit}
        />
    );
}
