declare global {
    interface Window {
        ENV: FirebaseConfig;
    }
}

export type FirebaseConfig = {
    API_KEY: string;
    AUTH_DOMAIN: string;
    PROJECT_ID: string;
    STORAGE_BUCKET: string;
    MESSAGING_SENDER_ID: string;
    APP_ID: string;
};

export default function Envs(props: FirebaseConfig) {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `window.ENV = ${JSON.stringify(props)}`,
            }}
        />
    );
}
