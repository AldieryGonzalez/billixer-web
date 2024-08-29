import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
import { nameToHexColor } from "~/lib/utils";

export default function Avatar({ name }: { name: string }) {
    const avatar = useMemo(() => {
        return createAvatar(thumbs, {
            size: 32,
            seed: name,
            shapeColor: [nameToHexColor(name)],
            backgroundColor: ["000000"],
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
