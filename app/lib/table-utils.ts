import { TableContextType } from "~/routes/$code";

export function calculateTableTotal({ data }: TableContextType) {
    return data.items.reduce((acc, item) => acc + item.price * 100, 0) / 100;
}

export function getUserSplit({ data }: TableContextType, uid: string) {
    const userItems = data.items.filter((item) => {
        item.guests.includes(uid);
    });
}

export function getItemSplit(item: TableContextType["data"]["items"][0]) {
    const total = item.price * item.quantity;
    const split = calculateFairSplit(total, item.guests.length);
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
