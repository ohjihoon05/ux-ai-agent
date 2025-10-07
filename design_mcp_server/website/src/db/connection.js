/**
 * Database Connection Module
 * Provides SQLite database connection with connection pooling
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default database path (can be overridden by environment variable)
const DATABASE_PATH = process.env.DATABASE_PATH || resolve(__dirname, '../../../database.sqlite');

// Connection pool configuration
const MAX_CONNECTIONS = 5;
const connectionPool = [];
let activeConnections = 0;

/**
 * Create a new database connection
 * @returns {Database} SQLite database instance
 */
function createConnection() {
  const db = new Database(DATABASE_PATH, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : null
  });

  // Enable Write-Ahead Logging for better concurrency
  db.pragma('journal_mode = WAL');

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Optimize for performance
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = 10000');
  db.pragma('temp_store = MEMORY');

  return db;
}

/**
 * Get a database connection from the pool
 * @returns {Database} SQLite database instance
 */
export function getConnection() {
  // Reuse existing connection if available
  if (connectionPool.length > 0) {
    return connectionPool.pop();
  }

  // Create new connection if pool is not at max capacity
  if (activeConnections < MAX_CONNECTIONS) {
    activeConnections++;
    return createConnection();
  }

  // If pool is exhausted, create a temporary connection
  console.warn('Connection pool exhausted, creating temporary connection');
  return createConnection();
}

/**
 * Release a connection back to the pool
 * @param {Database} db - Database connection to release
 */
export function releaseConnection(db) {
  if (!db) return;

  // Only pool permanent connections
  if (connectionPool.length < MAX_CONNECTIONS) {
    connectionPool.push(db);
  } else {
    db.close();
    activeConnections--;
  }
}

/**
 * Execute a query with automatic connection management
 * @param {Function} callback - Function that receives database connection
 * @returns {*} Query result
 */
export function withConnection(callback) {
  const db = getConnection();
  try {
    return callback(db);
  } finally {
    releaseConnection(db);
  }
}

/**
 * Execute a transaction with automatic connection management
 * @param {Function} callback - Transaction function
 * @returns {*} Transaction result
 */
export function withTransaction(callback) {
  return withConnection((db) => {
    const transaction = db.transaction(callback);
    return transaction(db);
  });
}

/**
 * Initialize database with schema
 * @returns {boolean} Success status
 */
export function initializeDatabase() {
  try {
    // Check if database file exists
    const dbExists = fs.existsSync(DATABASE_PATH);

    if (!dbExists) {
      console.log('Creating new database...');
      fs.mkdirSync(dirname(DATABASE_PATH), { recursive: true });
    }

    // Read schema file
    const schemaPath = resolve(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema
    return withConnection((db) => {
      db.exec(schema);
      console.log('Database schema initialized successfully');
      return true;
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

/**
 * Check database connection health
 * @returns {boolean} Connection status
 */
export function checkConnection() {
  try {
    return withConnection((db) => {
      const result = db.prepare('SELECT 1 as test').get();
      return result.test === 1;
    });
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

/**
 * Get database statistics
 * @returns {Object} Database stats
 */
export function getDatabaseStats() {
  return withConnection((db) => {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();

    const stats = {
      path: DATABASE_PATH,
      tables: {},
      totalSize: fs.statSync(DATABASE_PATH).size,
      activeConnections,
      poolSize: connectionPool.length
    };

    tables.forEach(({ name }) => {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${name}`).get();
      stats.tables[name] = count.count;
    });

    return stats;
  });
}

/**
 * Close all database connections
 */
export function closeAllConnections() {
  while (connectionPool.length > 0) {
    const db = connectionPool.pop();
    db.close();
  }
  activeConnections = 0;
  console.log('All database connections closed');
}

/**
 * Backup database to specified path
 * @param {string} backupPath - Path for backup file
 * @returns {boolean} Success status
 */
export function backupDatabase(backupPath) {
  try {
    return withConnection((db) => {
      const backup = db.backup(backupPath);
      backup.step(-1); // Copy entire database
      backup.finish();
      console.log(`Database backed up to ${backupPath}`);
      return true;
    });
  } catch (error) {
    console.error('Database backup failed:', error);
    return false;
  }
}

/**
 * Optimize database (VACUUM and ANALYZE)
 * @returns {boolean} Success status
 */
export function optimizeDatabase() {
  try {
    return withConnection((db) => {
      db.prepare('VACUUM').run();
      db.prepare('ANALYZE').run();
      console.log('Database optimized');
      return true;
    });
  } catch (error) {
    console.error('Database optimization failed:', error);
    return false;
  }
}

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  closeAllConnections();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  closeAllConnections();
  process.exit(0);
});

// Default export
export default {
  getConnection,
  releaseConnection,
  withConnection,
  withTransaction,
  initializeDatabase,
  checkConnection,
  getDatabaseStats,
  closeAllConnections,
  backupDatabase,
  optimizeDatabase
};
