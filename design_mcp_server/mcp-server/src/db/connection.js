/**
 * Database Connection Module for MCP Server
 *
 * Provides database connection to the component library SQLite database
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path - shared with website (in project root)
const DB_PATH = join(__dirname, '../../../database.sqlite');

let db = null;

/**
 * Initialize database connection
 */
export async function initDatabase() {
  if (db) {
    return db;
  }

  db = new Database(DB_PATH, {
    readonly: false, // Allow writes for analytics tracking
    fileMustExist: true, // Database should exist (created by website)
  });

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');

  // Optimize for read performance
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = 10000');
  db.pragma('temp_store = MEMORY');

  return db;
}

/**
 * Get database instance
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Execute a query with error handling
 */
export function query(sql, params = []) {
  try {
    const stmt = getDb().prepare(sql);
    return stmt.all(params);
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

/**
 * Execute a single row query
 */
export function queryOne(sql, params = []) {
  try {
    const stmt = getDb().prepare(sql);
    return stmt.get(params);
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

/**
 * Execute an insert/update/delete query
 */
export function execute(sql, params = []) {
  try {
    const stmt = getDb().prepare(sql);
    return stmt.run(params);
  } catch (error) {
    throw new Error(`Database execution failed: ${error.message}`);
  }
}

/**
 * Execute a transaction
 */
export function transaction(callback) {
  const db = getDb();
  const trx = db.transaction(callback);
  return trx();
}
