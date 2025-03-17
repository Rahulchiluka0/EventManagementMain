import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

// Get DATABASE_URL from Replit Secrets
let connectionString = process.env.DATABASE_URL;

// If DATABASE_URL is not available, show instructions
if (!connectionString) {
  console.error(`
========== DATABASE CONNECTION ERROR ==========
No PostgreSQL database connection found!

Please create a PostgreSQL database in Replit by:
1. Open a new tab in Replit
2. Type "Database" in the search bar
3. Choose "create a database"
4. Replit will automatically add DATABASE_URL to your Secrets

Your app will not work until you complete these steps.
==============================================
  `);
  process.exit(1);  // Exit with error if no database connection
}

// Create the connection pool
const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('.neon.tech') ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test connection
(async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

// Helper methods for common database operations
const query = (text, params) => pool.query(text, params);

const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default { query, getClient };