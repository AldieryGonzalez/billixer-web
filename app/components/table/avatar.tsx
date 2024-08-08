import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";

export default function Avatar({ name }: { name: string }) {
    const avatar = useMemo(() => {
        return createAvatar(thumbs, {
            size: 32,
            seed: name,
        }).toDataUri();
    }, [name]);
    return (
        <img
            className="rounded-full border-2 border-black/15"
            src={avatar}
            alt={name}
        />
    );
}
