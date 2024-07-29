import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export async function signInWithGoogle(clientAuth: Auth) {
  const provider = new GoogleAuthProvider();

  try {
    const userCredential = await signInWithPopup(clientAuth, provider);
    return await userCredential.user.getIdToken();
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}
