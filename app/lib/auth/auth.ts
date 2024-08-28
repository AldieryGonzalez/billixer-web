import { FirebaseError } from "firebase/app";
import {
    Auth,
    GoogleAuthProvider,
    signInAnonymously,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";

export async function signInWithEmail(
    clientAuth: Auth,
    email: string,
    password: string,
) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            clientAuth,
            email,
            password,
        );
        const idToken = await userCredential.user.getIdToken();
        return idToken;
    } catch (error) {
        console.error("Error signing in with email and password", error);
    }
}

export async function signInWithGoogle(clientAuth: Auth) {
    const provider = new GoogleAuthProvider();
    if (!clientAuth.currentUser) return;
    try {
        const userCredential = await signInWithPopup(clientAuth, provider);
        const idToken = await userCredential.user.getIdToken();
        return idToken;
    } catch (error) {
        const tError = error as FirebaseError;
        console.log({ ...tError });
    }
}

export async function signInWithAnon(clientAuth: Auth) {
    try {
        await signInAnonymously(clientAuth);
        const token = await clientAuth.currentUser?.getIdToken();
        return token;
    } catch (error) {
        console.error("Error signing in anonymously", error);
    }
}
