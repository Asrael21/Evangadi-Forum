import '../env.js';
import mysql from 'mysql2/promise';

const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

const sslConfig =
  process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true'
    ? { rejectUnauthorized: false }
    : undefined;

// Database connection pool supporting cloud MySQL (Render, Aiven, TiDB, etc.) and local configs
export const db = dbUrl
  ? mysql.createPool(
      sslConfig && !dbUrl.includes('ssl=')
        ? (dbUrl.includes('?') ? `${dbUrl}&ssl={"rejectUnauthorized":false}` : `${dbUrl}?ssl={"rejectUnauthorized":false}`)
        : dbUrl,
    )
  : mysql.createPool({
      host: process.env.DB_HOST || process.env.MYSQL_HOST || process.env.MYSQLHOST || 'localhost',
      user: process.env.DB_USER || process.env.MYSQL_USER || process.env.MYSQLUSER || '',
      password: process.env.DB_PASS || process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_PASS || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.MYSQL_DB || process.env.MYSQLDATABASE || '',
      port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306),
      ssl: sslConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

const ensureParams = params => {
  if (params === undefined || params === null) {
    throw new Error('SQL parameters are required');
  }
  const isArray = Array.isArray(params);
  const isObject = !isArray && typeof params === 'object';
  if (!isArray && !isObject) {
    throw new Error('SQL parameters must be an array or object');
  }
};

export const safeExecute = async (sql, params) => {
  if (typeof sql !== 'string' || sql.trim().length === 0) {
    throw new Error('SQL query must be a non-empty string');
  }
  ensureParams(params);
  const [result] = await db.execute(sql, params);
  return result;
};
