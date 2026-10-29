import dotenv from 'dotenv';


dotenv.config({ path: '../../.env' });

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.API_PORT) || 3000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    },
};