import * as z from "zod";

const environmentSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    API_KEY: z.string().min(1),
    AUTH_DOMAIN: z.string().min(1),
    PROJECT_ID: z.string().min(1),
    STORAGE_BUCKET: z.string().min(1),
    MESSAGING_SENDER_ID: z.string().min(1),
    APP_ID: z.string().min(1),
});

const env = () => environmentSchema.parse(process.env);

export { env };
