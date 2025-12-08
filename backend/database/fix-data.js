/**
 * Fix invalid JSON data in database
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixData() {
  console.log('🔧 Starting data fix...\n');

  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'siara_events',
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    // 1. Fix site_settings - convert plain strings to JSON
    console.log('📝 Fixing site_settings...');
    const [settings] = await pool.query('SELECT * FROM site_settings');
    
    for (const setting of settings) {
      const value = setting.setting_value;
      
      // Check if value is already valid JSON
      try {
        JSON.parse(value);
        console.log(`  ✓ ${setting.setting_key} - already valid JSON`);
      } catch {
        // Convert plain string to JSON string
        const jsonValue = JSON.stringify(value);
        await pool.query(
          'UPDATE site_settings SET setting_value = ? WHERE id = ?',
          [jsonValue, setting.id]
        );
        console.log(`  ✓ ${setting.setting_key} - converted to JSON`);
      }
    }

    // 2. Fix pages.sections - ensure it's valid JSON array
    console.log('\n📄 Fixing pages.sections...');
    const [pages] = await pool.query('SELECT id, slug, sections FROM pages');
    
    for (const page of pages) {
      if (!page.sections) {
        // Set to empty array if null
        await pool.query('UPDATE pages SET sections = ? WHERE id = ?', ['[]', page.id]);
        console.log(`  ✓ ${page.slug} - set to empty array`);
        continue;
      }

      try {
        const parsed = JSON.parse(page.sections);
        if (Array.isArray(parsed)) {
          console.log(`  ✓ ${page.slug} - already valid JSON array`);
        } else {
          // Not an array, wrap in array or reset
          await pool.query('UPDATE pages SET sections = ? WHERE id = ?', ['[]', page.id]);
          console.log(`  ✓ ${page.slug} - reset to empty array (was not array)`);
        }
      } catch {
        // Invalid JSON, reset to empty array
        await pool.query('UPDATE pages SET sections = ? WHERE id = ?', ['[]', page.id]);
        console.log(`  ✓ ${page.slug} - reset to empty array (invalid JSON)`);
      }
    }

    // 3. Fix sections.content - ensure it's valid JSON object
    console.log('\n🧩 Fixing sections.content...');
    const [sections] = await pool.query('SELECT id, name, content, settings FROM sections');
    
    for (const section of sections) {
      let needsUpdate = false;
      let newContent = section.content;
      let newSettings = section.settings;

      // Fix content
      if (!section.content) {
        newContent = '{}';
        needsUpdate = true;
      } else {
        try {
          JSON.parse(section.content);
        } catch {
          newContent = '{}';
          needsUpdate = true;
        }
      }

      // Fix settings
      if (!section.settings) {
        newSettings = '{}';
        needsUpdate = true;
      } else {
        try {
          JSON.parse(section.settings);
        } catch {
          newSettings = '{}';
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await pool.query(
          'UPDATE sections SET content = ?, settings = ? WHERE id = ?',
          [newContent, newSettings, section.id]
        );
        console.log(`  ✓ ${section.name} - fixed`);
      } else {
        console.log(`  ✓ ${section.name} - already valid`);
      }
    }

    // 4. Check services JSON fields
    console.log('\n🛠️ Fixing services JSON fields...');
    const [services] = await pool.query('SELECT id, name, pricing, inclusions, process_steps, faqs, gallery FROM services');
    
    const jsonFields = ['pricing', 'inclusions', 'process_steps', 'faqs', 'gallery'];
    
    for (const service of services) {
      const updates = {};
      
      for (const field of jsonFields) {
        if (service[field]) {
          try {
            JSON.parse(service[field]);
          } catch {
            updates[field] = '[]';
          }
        }
      }
      
      if (Object.keys(updates).length > 0) {
        const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        await pool.query(
          `UPDATE services SET ${setClauses} WHERE id = ?`,
          [...Object.values(updates), service.id]
        );
        console.log(`  ✓ ${service.name} - fixed ${Object.keys(updates).join(', ')}`);
      } else {
        console.log(`  ✓ ${service.name} - already valid`);
      }
    }

    console.log('\n✅ Data fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing data:', error);
  } finally {
    await pool.end();
  }
}

fixData();

