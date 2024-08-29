import { useOutletContext } from "@remix-run/react";
import { Pencil, Trash2 } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import { useTableItems } from "~/hooks/useTableItems";
import { toggleClaimItem } from "~/lib/db/firestore";
import { useFirebase } from "~/lib/firebase";
import { cn, nameToHexColor, shortenName } from "~/lib/utils";
import { TableContextType } from "~/routes/$code";

export default function BaseItem({
    item,
    isEditing,
    handleSetEdit,
    handleSetDelete,
}: {
    item: ReturnType<typeof useTableItems>[0];
    isEditing: boolean;
    handleSetEdit: () => void;
    handleSetDelete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const { data, session } = useOutletContext<TableContextType>();
    const { db } = useFirebase();
    const isClaimed = item.guests.includes(session.uid);
    const claimItem: MouseEventHandler = (e) => {
        e.preventDefault();
        toggleClaimItem(db, session.uid, data.code, item);
    };
    const fakeNames = ["Aldiery Rene Gonzalez", "Ria", "Reniel", "Ben", "Jon"];
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size="xs"
                        variant="item"
                        className={cn(
                            "col-span-3 row-span-2 grid h-max grid-cols-subgrid",
                            isClaimed && "bg-jonquil/70",
                        )}
                        disabled={isEditing}
                    >
                        <span className="justify-self-start pl-2 text-sm">
                            {item.quantity}
                        </span>
                        <span className="w-full truncate text-left">
                            {item.name}
                        </span>
                        <span className="items-end justify-self-end pr-2">
                            ${item.price.toFixed(2)}
                        </span>
                        {item.guests.length > 0 ? (
                            <span className="col-span-3 flex w-full gap-0.5 overflow-hidden rounded-b-md border-t border-black bg-black/30 text-left text-xs font-light text-white">
                                {fakeNames.map((id, i) => {
                                    return (
                                        <div
                                            key={id}
                                            className="h-2 w-2"
                                            style={{
                                                backgroundColor: `#${nameToHexColor(id)}`,
                                                width: `${100 / fakeNames.length}%`,
                                            }}
                                        />
                                    );
                                })}
                            </span>
                        ) : (
                            <span className="col-span-3 flex h-2 w-full justify-center gap-0.5 overflow-hidden rounded-b-md border-t border-black bg-black/30 px-2 text-xs font-light text-white"></span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                            value="item-1"
                            className="border-b-2 border-l-4 px-2"
                            style={{
                                borderLeftColor: `#${nameToHexColor("Aldiery Rene Gonzalez")}`,
                            }}
                        >
                            <AccordionTrigger>Aldiery</AccordionTrigger>
                            <AccordionContent>configure here</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Ria</AccordionTrigger>
                            <AccordionContent>
                                Yes. It comes with default styles that matches
                                the other components&apos; aesthetic.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Reniel</AccordionTrigger>
                            <AccordionContent>
                                Yes. It&apos;s animated by default, but you can
                                disable it if you prefer.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </PopoverContent>
            </Popover>
            {isEditing ? (
                <>
                    <Button
                        size="xs"
                        variant="outline"
                        className="text-xs"
                        onClick={handleSetEdit}
                    >
                        <Pencil
                            strokeWidth={1}
                            size={18}
                            fill="hsl(var(--jonquil))"
                        />
                    </Button>
                    <Button
                        size="xs"
                        variant="destructive"
                        className="text-xs"
                        onClick={handleSetDelete}
                    >
                        <Trash2 size={18} />
                    </Button>
                </>
            ) : (
                <input
                    className="col-span-1 row-span-2"
                    type="checkbox"
                    checked={isClaimed}
                    onClick={claimItem}
                />
            )}
        </>
    );
}
