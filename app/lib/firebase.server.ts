import admin from "firebase-admin";
import { cert, initializeApp as initializeServerApp } from "firebase-admin/app";

if (!admin.apps.length) {
    initializeServerApp({
        projectId: process.env.ADMIN_PROJECT_ID,
        credential: cert({
            clientEmail: process.env.ADMIN_CLIENT_EMAIL,
            privateKey: process.env.ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
            projectId: process.env.ADMIN_PROJECT_ID,
        }),
        databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`,
    });
}
const db = admin.firestore();
const auth = admin.auth();

export { auth, db };
