import AddItemButton from "./atoms/button";
import AddItemForm from "./atoms/form";

export default function AddItem({
    isAdding,
    isEditing,
    setIsAdding,
}: {
    isAdding: boolean;
    isEditing: boolean;
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <>
            {!isEditing && (
                <>
                    {isAdding ? (
                        <AddItemForm setIsAdding={setIsAdding} />
                    ) : (
                        <AddItemButton setIsAdding={setIsAdding} />
                    )}
                </>
            )}
        </>
    );
}
