import {
    Auth,
    GoogleAuthProvider,
    linkWithPopup,
    signInAnonymously,
} from "firebase/auth";

export async function signInWithGoogle(clientAuth: Auth) {
    const provider = new GoogleAuthProvider();
    if (!clientAuth.currentUser) return;

    try {
        const userCredential = await linkWithPopup(
            clientAuth.currentUser,
            provider,
        );
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
