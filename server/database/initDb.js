// Database migration runner: reads and executes init.sql to bootstrap schemas and
// verify the active PostGIS extension version on demand (via npm run db:init).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('🔄 Running database initialization & PostGIS setup...');
  try {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);
    console.log('✅ Database schema and PostGIS extension initialized successfully!');

    // Test PostGIS query
    const res = await pool.query('SELECT PostGIS_Version();');
    console.log(`📍 PostGIS active version: ${res.rows[0].postgis_version}`);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
