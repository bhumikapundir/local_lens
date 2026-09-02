// PostgreSQL & PostGIS connection pool: manages database client connections and provides
// health check validation for spatial query readiness.
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'local_lens_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgrespassword',
    };

const pool = new Pool({
  ...poolConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle PostgreSQL client:', err.message);
});

export const checkDatabaseHealth = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, PostGIS_Version() as postgis_version;');
    client.release();
    return {
      status: 'UP',
      time: result.rows[0].current_time,
      postgisVersion: result.rows[0].postgis_version,
    };
  } catch (error) {
    return {
      status: 'DOWN',
      error: error.message,
    };
  }
};

export default pool;
