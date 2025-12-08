const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const seedDatabase = async () => {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database');

    // Hash password for admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Check if admin exists
    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@siara.com']
    );

    if (existingAdmin.length > 0) {
      // Update existing admin password
      await connection.query(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'admin', 'admin@siara.com']
      );
      console.log('✅ Admin user password updated');
    } else {
      // Create admin user
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Siara Admin', 'admin@siara.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin user created');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@siara.com');
    console.log('   Password: admin123');
    console.log('\n🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Seed error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
};

seedDatabase();

