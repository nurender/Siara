/**
 * Database Migration Script
 * Adds new columns to existing tables
 * Run: node database/migrate.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'siara_events',
};

async function migrate() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');

    // Helper function to check if column exists
    async function columnExists(table, column) {
      const [rows] = await connection.query(
        `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [dbConfig.database, table, column]
      );
      return rows[0].count > 0;
    }

    // Helper function to add column if not exists
    async function addColumn(table, column, definition, after = null) {
      const exists = await columnExists(table, column);
      if (!exists) {
        const afterClause = after ? ` AFTER ${after}` : '';
        await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}${afterClause}`);
        console.log(`  ✓ Added ${table}.${column}`);
        return true;
      }
      return false;
    }

    console.log('📦 Migrating services table...');
    await addColumn('services', 'full_description', 'TEXT', 'short_description');
    await addColumn('services', 'featured_image', 'VARCHAR(500)', 'icon');
    await addColumn('services', 'gallery', 'JSON', 'featured_image');
    await addColumn('services', 'pricing', 'JSON', 'gallery');
    await addColumn('services', 'inclusions', 'JSON', 'pricing');
    await addColumn('services', 'process_steps', 'JSON', 'inclusions');
    await addColumn('services', 'faqs', 'JSON', 'process_steps');
    await addColumn('services', 'meta_title', 'VARCHAR(70)', 'faqs');
    await addColumn('services', 'meta_description', 'VARCHAR(160)', 'meta_title');
    await addColumn('services', 'is_featured', 'BOOLEAN DEFAULT FALSE', 'is_active');
    await addColumn('services', 'status', "ENUM('draft', 'published') DEFAULT 'published'", 'is_featured');

    console.log('\n📦 Migrating portfolio table...');
    await addColumn('portfolio', 'subtitle', 'VARCHAR(255)', 'title');
    await addColumn('portfolio', 'venue', 'VARCHAR(255)', 'location');
    await addColumn('portfolio', 'summary', 'TEXT', 'client_name');
    await addColumn('portfolio', 'story', 'TEXT', 'summary');
    await addColumn('portfolio', 'services_delivered', 'JSON', 'gallery');
    await addColumn('portfolio', 'meta_title', 'VARCHAR(70)', 'testimonial');
    await addColumn('portfolio', 'meta_description', 'VARCHAR(160)', 'meta_title');
    await addColumn('portfolio', 'status', "ENUM('draft', 'published') DEFAULT 'published'", 'is_active');

    console.log('\n========================================');
    console.log('🎉 MIGRATION COMPLETE!');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();

