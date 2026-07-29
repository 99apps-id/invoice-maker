import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from parent root directory or current server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const { Pool } = pg;

let pool: pg.Pool;

if (process.env.DATABASE_URL) {
  const useSsl = process.env.DATABASE_SSL === 'true';
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl
      ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' }
      : false,
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'tagihdong',
  });
}

pool.on('connect', () => {
  console.log('🐘 Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Unexpected Error:', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
