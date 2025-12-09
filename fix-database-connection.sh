#!/bin/bash

echo "=========================================="
echo "  Fix Database Connection Issue"
echo "=========================================="
echo ""

cd ~/siara-events

echo "1. Checking MySQL Service..."
if systemctl is-active --quiet mysql 2>/dev/null || service mysql status >/dev/null 2>&1; then
    echo "✅ MySQL service is running"
else
    echo "❌ MySQL service is not running!"
    echo "   Starting MySQL..."
    sudo systemctl start mysql 2>/dev/null || sudo service mysql start 2>/dev/null
    sleep 2
fi

echo ""
echo "2. Testing MySQL Connection..."
mysql -u siara_user -psiara_password_2024 -e "SELECT 1;" 2>&1
if [ $? -eq 0 ]; then
    echo "✅ MySQL connection OK with siara_user"
else
    echo "⚠️  Connection failed with siara_user, trying root..."
    mysql -u root -e "SELECT 1;" 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ MySQL connection OK with root"
        echo "   Note: Using root user (consider creating siara_user)"
    else
        echo "❌ MySQL connection failed!"
        echo "   Please check MySQL service and credentials"
        exit 1
    fi
fi

echo ""
echo "3. Checking Database..."
mysql -u siara_user -psiara_password_2024 -e "USE siara_events; SHOW TABLES;" 2>&1 | head -5
if [ $? -ne 0 ]; then
    echo "⚠️  Database siara_events not accessible or doesn't exist"
    echo "   Creating database..."
    mysql -u siara_user -psiara_password_2024 -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>&1
    echo "   Setting up tables..."
    cd backend
    node database/setup.js 2>&1 | tail -3
    cd ..
fi

echo ""
echo "4. Updating backend/.env..."
cd backend
if [ -f ".env" ]; then
    # Force IPv4 instead of localhost
    if grep -q "DB_HOST=localhost" .env; then
        sed -i 's/DB_HOST=localhost/DB_HOST=127.0.0.1/' .env
        echo "✅ Changed DB_HOST from localhost to 127.0.0.1"
    fi
    
    # Ensure all required variables are set
    if ! grep -q "JWT_EXPIRES_IN" .env; then
        echo "JWT_EXPIRES_IN=7d" >> .env
        echo "✅ Added JWT_EXPIRES_IN"
    fi
    
    if ! grep -q "DB_NAME" .env; then
        echo "DB_NAME=siara_events" >> .env
        echo "✅ Added DB_NAME"
    fi
    
    echo ""
    echo "Current .env configuration:"
    grep -E "DB_HOST|DB_USER|DB_PASSWORD|DB_NAME|JWT" .env | head -6
else
    echo "❌ backend/.env not found!"
    if [ -f "../.env" ]; then
        cp ../.env .env
        sed -i 's/DB_HOST=localhost/DB_HOST=127.0.0.1/' .env
        echo "✅ Created .env from root .env"
    else
        echo "❌ Root .env also not found!"
        exit 1
    fi
fi
cd ..

echo ""
echo "5. Testing Node.js Database Connection..."
cd backend
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  try {
    const host = process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST;
    const conn = await mysql.createConnection({
      host: host || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'siara_events'
    });
    console.log('✅ Node.js database connection OK');
    await conn.end();
  } catch (error) {
    console.log('❌ Node.js database connection failed:', error.message);
    process.exit(1);
  }
})();
" || {
    echo "❌ Node.js connection test failed!"
    exit 1
}
cd ..

echo ""
echo "6. Testing Backend Server..."
cd backend
timeout 5 node server.js 2>&1 | head -15 || echo "   (Server test complete)"
cd ..

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Restart backend: pm2 restart siara-backend"
echo "  2. Check logs: pm2 logs siara-backend"
echo "  3. Test API: curl http://localhost:5000/api/health"
echo ""

