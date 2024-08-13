import {
    Auth,
    GoogleAuthProvider,
    signInAnonymously,
    signInWithPopup,
} from "firebase/auth";

export async function signInWithGoogle(clientAuth: Auth) {
    const provider = new GoogleAuthProvider();

    try {
        const userCredential = await signInWithPopup(clientAuth, provider);
        return await userCredential.user.getIdToken();
    } catch (error) {
        console.error("Error signing in with Google", error);
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
