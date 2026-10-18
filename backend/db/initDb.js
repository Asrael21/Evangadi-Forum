import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import '../env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

async function initDatabase() {
  console.log('--- Initializing Evangadi Forum Database ---');

  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`schema.sql not found at ${schemaPath}`);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  let connection;
  try {
    const sslRequired = process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true';

    if (dbUrl) {
      const url = new URL(dbUrl);
      url.searchParams.set('multipleStatements', 'true');
      if (sslRequired && !url.searchParams.has('ssl')) {
        url.searchParams.set('ssl', '{"rejectUnauthorized":false}');
      }
      console.log(`Connecting via URL to database...`);
      connection = await mysql.createConnection(url.toString());
    } else {
      const config = {
        host: process.env.DB_HOST || process.env.MYSQL_HOST || process.env.MYSQLHOST || 'localhost',
        user: process.env.DB_USER || process.env.MYSQL_USER || process.env.MYSQLUSER || '',
        password: process.env.DB_PASS || process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_PASS || process.env.MYSQLPASSWORD || '',
        database: process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.MYSQL_DB || process.env.MYSQLDATABASE || '',
        port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306),
        ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
        multipleStatements: true,
      };
      console.log(`Connecting to MySQL at ${config.host}:${config.port}, DB: ${config.database}...`);
      connection = await mysql.createConnection(config);
    }

    console.log('Connected successfully. Executing schema.sql statements...');
    await connection.query(schemaSql);
    console.log('✅ All tables and schemas created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
