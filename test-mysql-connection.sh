#!/bin/bash
# Test MySQL connection without sudo

cd ~/siara-events/backend

echo "🔍 Testing MySQL Connection..."
echo ""

# Test 1: Direct connection
echo "1️⃣ Testing direct MySQL connection..."
if mysql -u root -e "SELECT 1;" 2>/dev/null; then
    echo "   ✅ MySQL accessible without password"
else
    echo "   ❌ MySQL connection failed"
    echo "   Error details:"
    mysql -u root -e "SELECT 1;" 2>&1 | head -3
fi

# Test 2: Database exists
echo ""
echo "2️⃣ Checking database..."
if mysql -u root -e "USE siara_events; SELECT 1;" 2>/dev/null; then
    echo "   ✅ Database 'siara_events' exists"
    
    # Count tables
    TABLE_COUNT=$(mysql -u root siara_events -e "SHOW TABLES;" 2>/dev/null | wc -l)
    echo "   ✅ Found $TABLE_COUNT tables"
else
    echo "   ⚠️  Database 'siara_events' does not exist"
    echo "   Creating database..."
    mysql -u root -e "CREATE DATABASE siara_events;" 2>/dev/null && echo "   ✅ Database created" || echo "   ❌ Failed to create"
fi

# Test 3: Node.js connection test
echo ""
echo "3️⃣ Testing Node.js database connection..."
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    console.log('   Connecting with:');
    console.log('     Host:', process.env.DB_HOST);
    console.log('     User:', process.env.DB_USER);
    console.log('     Password:', process.env.DB_PASSWORD ? '***' : '(empty)');
    console.log('     Database:', process.env.DB_NAME);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'siara_events'
    });
    
    console.log('   ✅ Node.js connection successful!');
    await connection.end();
  } catch (error) {
    console.log('   ❌ Node.js connection failed!');
    console.log('   Error:', error.message);
    console.log('   Code:', error.code);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('');
      console.log('   💡 Solution: Fix MySQL password');
      console.log('      sudo mysql');
      console.log('      ALTER USER \"root\"@\"localhost\" IDENTIFIED WITH mysql_native_password BY \"\";');
      console.log('      FLUSH PRIVILEGES;');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('   💡 Solution: Start MySQL service');
      console.log('      sudo systemctl start mysql');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('');
      console.log('   💡 Solution: Create database');
      console.log('      mysql -u root -e \"CREATE DATABASE siara_events;\"');
    }
    process.exit(1);
  }
})();
" 2>&1

echo ""
echo "================================="
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Connection test failed"
    echo ""
    echo "Next steps:"
    echo "1. Check MySQL is running: mysql -u root -e 'SELECT 1;'"
    echo "2. Create database: mysql -u root -e 'CREATE DATABASE siara_events;'"
    echo "3. Fix MySQL auth: sudo mysql -e \"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';\""
fi

