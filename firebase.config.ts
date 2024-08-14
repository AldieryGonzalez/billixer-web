import { env } from "~/env.server";

const getFirebaseEnvs = () => ({
    API_KEY: env().API_KEY,
    AUTH_DOMAIN: env().AUTH_DOMAIN,
    PROJECT_ID: env().PROJECT_ID,
    STORAGE_BUCKET: env().STORAGE_BUCKET,
    MESSAGING_SENDER_ID: env().MESSAGING_SENDER_ID,
    APP_ID: env().APP_ID,
});

export { getFirebaseEnvs };
