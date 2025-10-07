#!/usr/bin/env node
/**
 * Database Initialization Script
 * Creates and initializes the SQLite database with schema
 */

import { initializeDatabase, getDatabaseStats, checkConnection } from './connection.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🗄️  Initializing database...\n');

try {
  // Initialize database schema
  const success = initializeDatabase();

  if (success) {
    console.log('✓ Database schema created successfully\n');

    // Check connection
    const isConnected = checkConnection();
    if (isConnected) {
      console.log('✓ Database connection verified\n');

      // Display stats
      const stats = getDatabaseStats();
      console.log('📊 Database Statistics:');
      console.log(`   Path: ${stats.path}`);
      console.log(`   Size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
      console.log(`   Tables: ${Object.keys(stats.tables).length}`);
      console.log('\n   Table Rows:');
      Object.entries(stats.tables).forEach(([table, count]) => {
        console.log(`   - ${table}: ${count}`);
      });

      console.log('\n✅ Database initialization complete!');
      console.log('\n💡 Next steps:');
      console.log('   1. Run: npm run db:seed');
      console.log('   2. Start dev server: npm run dev');
    } else {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
  } else {
    console.error('❌ Database initialization failed');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error initializing database:', error);
  process.exit(1);
}
