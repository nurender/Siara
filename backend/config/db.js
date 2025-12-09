const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
// Force IPv4 if localhost is used (to avoid IPv6 ::1 issues)
const dbHost = process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST;

const pool = mysql.createPool({
  host: dbHost,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };

