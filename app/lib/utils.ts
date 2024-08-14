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
