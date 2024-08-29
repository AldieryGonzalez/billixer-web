import { type ClassValue, clsx } from "clsx";
import { FirebaseOptions } from "firebase/app";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateTableCode() {
    const alphanumeric =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += alphanumeric.charAt(
            Math.floor(Math.random() * alphanumeric.length),
        );
    }
    return code;
}

type NameStyle = "first" | "initials" | "first+initials";
export function shortenName(name: string, style: NameStyle = "first"): string {
    switch (style) {
        case "first":
            return name.split(" ")[0];
        case "initials":
            return name
                .split(" ")
                .map((n) => n[0])
                .join("");
        case "first+initials": {
            const s = name.split(" ");
            const first = s[0];
            return `${first} ${shortenName(name.slice(first.length), "initials")}`;
        }
    }
}

export function nameToHexColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "000000".substring(0, 6 - color.length) + color;
}

function isBrowser() {
    return typeof window !== "undefined";
}

export function getFirebaseConfig() {
    const env = isBrowser() ? window.ENV : process.env;
    return {
        apiKey: env.API_KEY,
        authDomain: env.AUTH_DOMAIN,
        projectId: env.PROJECT_ID,
        storageBucket: env.STORAGE_BUCKET,
        messagingSenderId: env.MESSAGING_SENDER_ID,
        appId: env.APP_ID,
    } satisfies FirebaseOptions;
}
