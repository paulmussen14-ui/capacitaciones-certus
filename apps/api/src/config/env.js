import dotenv from "dotenv";


dotenv.config({ path: "../../.env" });

const nodeEnv = process.env.NODE_ENV || "development";


const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret || sessionSecret.length < 16) {
    throw new Error(
        "Falta SESSION_SECRET en el .env o es muy corta (mínimo 16 caracteres).",
    );
    }

    const allowedEmailDomain = (process.env.ALLOWED_EMAIL_DOMAIN || "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "");
    if (!allowedEmailDomain) {
    throw new Error(
        "Falta ALLOWED_EMAIL_DOMAIN en el .env (por ejemplo: certus.edu.pe).",
    );
    }

    export const env = {
    nodeEnv,
    port: Number(process.env.API_PORT) || 3000,
    db: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.POSTGRES_PORT) || 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    },
    allowedEmailDomain,
    session: {
        secret: sessionSecret,
        hours: Number(process.env.SESSION_HOURS) || 8,
        cookieName: "token",
    },
};