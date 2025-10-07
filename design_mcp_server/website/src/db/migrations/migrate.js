/**
 * Database Migration System
 * Handles schema migrations with version tracking
 */

import { withConnection } from '../connection.js';
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get current schema version from database
 * @param {Database} db - Database connection
 * @returns {number} Current version
 */
function getCurrentVersion(db) {
  try {
    const result = db.prepare('SELECT MAX(version) as version FROM schema_migrations').get();
    return result.version || 0;
  } catch (error) {
    // Table doesn't exist yet
    return 0;
  }
}

/**
 * Apply a single migration
 * @param {Database} db - Database connection
 * @param {number} version - Migration version
 * @param {string} sql - Migration SQL
 */
function applyMigration(db, version, sql) {
  const transaction = db.transaction(() => {
    // Execute migration SQL
    db.exec(sql);

    // Record migration
    db.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(version);

    console.log(`✓ Applied migration v${version}`);
  });

  transaction();
}

/**
 * Get all available migrations
 * @returns {Array} List of migrations
 */
function getAvailableMigrations() {
  const migrationsDir = __dirname;
  const files = fs.readdirSync(migrationsDir);

  const migrations = files
    .filter(file => file.match(/^\d{3}_.*\.sql$/))
    .map(file => {
      const version = parseInt(file.split('_')[0]);
      const name = file.replace(/^\d{3}_/, '').replace('.sql', '');
      const path = resolve(migrationsDir, file);
      const sql = fs.readFileSync(path, 'utf-8');

      return { version, name, sql, file };
    })
    .sort((a, b) => a.version - b.version);

  return migrations;
}

/**
 * Run pending migrations
 * @returns {number} Number of migrations applied
 */
export function runMigrations() {
  return withConnection((db) => {
    const currentVersion = getCurrentVersion(db);
    const migrations = getAvailableMigrations();
    const pending = migrations.filter(m => m.version > currentVersion);

    if (pending.length === 0) {
      console.log('No pending migrations');
      return 0;
    }

    console.log(`Found ${pending.length} pending migration(s)`);

    pending.forEach(migration => {
      console.log(`Applying migration v${migration.version}: ${migration.name}`);
      applyMigration(db, migration.version, migration.sql);
    });

    console.log(`✓ Applied ${pending.length} migration(s)`);
    return pending.length;
  });
}

/**
 * Get migration status
 * @returns {Object} Migration status
 */
export function getMigrationStatus() {
  return withConnection((db) => {
    const currentVersion = getCurrentVersion(db);
    const migrations = getAvailableMigrations();
    const applied = migrations.filter(m => m.version <= currentVersion);
    const pending = migrations.filter(m => m.version > currentVersion);

    return {
      currentVersion,
      totalMigrations: migrations.length,
      appliedMigrations: applied.length,
      pendingMigrations: pending.length,
      applied: applied.map(m => ({ version: m.version, name: m.name })),
      pending: pending.map(m => ({ version: m.version, name: m.name }))
    };
  });
}

/**
 * Create a new migration file
 * @param {string} name - Migration name
 * @returns {string} Migration file path
 */
export function createMigration(name) {
  const migrations = getAvailableMigrations();
  const nextVersion = migrations.length > 0
    ? Math.max(...migrations.map(m => m.version)) + 1
    : 2; // Start from 2 (1 is initial schema)

  const filename = `${String(nextVersion).padStart(3, '0')}_${name.replace(/\s+/g, '_')}.sql`;
  const filepath = resolve(__dirname, filename);

  const template = `-- Migration: ${name}
-- Version: ${nextVersion}
-- Created: ${new Date().toISOString()}

-- Add your migration SQL here
`;

  fs.writeFileSync(filepath, template, 'utf-8');
  console.log(`Created migration: ${filename}`);

  return filepath;
}

export default {
  runMigrations,
  getMigrationStatus,
  createMigration
};
