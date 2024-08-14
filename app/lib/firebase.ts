import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { useShared } from "~/contexts/global";
import { getFirebaseConfig } from "./utils";

const firebase_config = getFirebaseConfig();

export const app = getApps().length ? getApp() : initializeApp(firebase_config);

export const auth = getAuth();
export const db = getFirestore();

if (process.env.NODE_ENV === "development") {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
}

const _useFirebase = () => ({
    auth: getAuth(),
    db: getFirestore(),
});

export const useFirebase = (init?: boolean) =>
    useShared("firebase", _useFirebase, init);
