import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/(\?|&)sslmode=require/i, '') : undefined;

const pool = new Pool(
    dbUrl
        ? {
              connectionString: dbUrl,
              ssl: { rejectUnauthorized: false }
          }
        : {
              user: process.env.DB_USER || 'postgres',
              host: process.env.DB_HOST || 'localhost',
              database: process.env.DB_NAME || 'easypharma',
              password: process.env.DB_PASSWORD || 'postgres',
              port: parseInt(process.env.DB_PORT || '5432', 10),
              ssl: { rejectUnauthorized: false }
          }
);

pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

export default pool;
