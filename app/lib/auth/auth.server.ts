import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { auth as serverAuth } from "../firebase.server";

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
        cookie: {
            name: "__session",
            secure: process.env.NODE_ENV === "production",
            secrets: [process.env.SESSION_SECRET!],
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
            httpOnly: true,
        },
    });

async function createSessionToken(idToken: string) {
    const decodedToken = await serverAuth.verifyIdToken(idToken);
    if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
        throw new Error("Recent sign in required");
    }
    const twentyFourHours = 1000 * 60 * 60 * 24;
    return serverAuth.createSessionCookie(idToken, {
        expiresIn: twentyFourHours,
    });
}

export async function checkSession(request: Request) {
    const session = await getSession(request.headers.get("cookie"));
    const token = session.get("token");
    if (!token) return null;

    try {
        const decodedClaims = await serverAuth.verifySessionCookie(token);
        return decodedClaims;
    } catch (error) {
        console.error("Error verifying session", error);
        return null;
    }
}

export async function sessionLogin(
    request: Request,
    idToken: string,
    redirectTo?: string,
) {
    const session = await getSession(request.headers.get("cookie"));
    const token = await createSessionToken(idToken);
    session.set("token", token);
    if (redirectTo) {
        return redirect(redirectTo, {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } else {
        return new Response(null, {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }
}

export async function sessionLogout(request: Request, redirectTo: string) {
    const session = await getSession(request.headers.get("cookie"));
    const decodedClaims = await serverAuth.verifySessionCookie(
        session.get("token"),
    );
    await serverAuth.revokeRefreshTokens(decodedClaims.sub);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}
