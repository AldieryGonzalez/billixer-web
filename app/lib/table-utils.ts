import { useTableItems } from "~/hooks/useTableItems";

export function calculateTableTotal(
    tableItems: ReturnType<typeof useTableItems>,
) {
    return tableItems.reduce((acc, item) => acc + item.price * 100, 0) / 100;
}

export function getUserSplit(
    tableItems: ReturnType<typeof useTableItems>,
    uid: string,
) {
    const userItems = tableItems.filter((item) => {
        item.guests.includes(uid);
    });
    userItems;
    // This is incomplete // TODO: IMPLEMENT
    return null;
}

export function getItemSplit(item: ReturnType<typeof useTableItems>[0]) {
    const total = item.price * item.quantity;
    const split = calculateFairSplit(total, item.guests.length);
    split;

    // This is incomplete // TODO: IMPLEMENT
    return null;
}
function calculateFairSplit(
    totalAmount: number,
    numberOfPeople: number,
): number[] {
    const splitAmount = Math.floor((totalAmount * 100) / numberOfPeople) / 100;
    const remainingAmount = totalAmount - splitAmount * numberOfPeople;

    const split = Array(numberOfPeople).fill(splitAmount);
    for (let i = 0; i < remainingAmount * 100; i++) {
        split[i % numberOfPeople] += 0.01;
    }

    return split;
}
