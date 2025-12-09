#!/bin/bash
# Fix database connection error

cd ~/siara-events

echo "🔧 Fixing Database Connection..."
echo "================================="
echo ""

# Step 1: Check MySQL service
echo "1️⃣ Checking MySQL service..."
if sudo systemctl is-active --quiet mysql; then
    echo "   ✅ MySQL is running"
else
    echo "   ⚠️  MySQL not running - starting..."
    sudo systemctl start mysql
    sleep 2
    if sudo systemctl is-active --quiet mysql; then
        echo "   ✅ MySQL started"
    else
        echo "   ❌ Failed to start MySQL"
        echo "   Try: sudo systemctl status mysql"
        exit 1
    fi
fi

# Step 2: Fix MySQL authentication
echo ""
echo "2️⃣ Fixing MySQL authentication..."
sudo mysql << EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EOF
echo "   ✅ MySQL authentication fixed"

# Step 3: Test connection
echo ""
echo "3️⃣ Testing MySQL connection..."
if mysql -u root -e "SELECT 1;" 2>/dev/null; then
    echo "   ✅ MySQL connection successful"
else
    echo "   ❌ MySQL connection still failing"
    exit 1
fi

# Step 4: Create database
echo ""
echo "4️⃣ Creating database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>/dev/null && echo "   ✅ Database ready" || echo "   ❌ Failed to create database"

# Step 5: Update .env
echo ""
echo "5️⃣ Updating .env files..."
# Ensure DB_PASSWORD is empty
if grep -q "^DB_PASSWORD=" .env; then
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env
else
    echo "DB_PASSWORD=" >> .env
fi

# Copy to backend
cp .env backend/.env
echo "   ✅ .env files updated"

# Step 6: Check database tables
echo ""
echo "6️⃣ Checking database tables..."
TABLE_COUNT=$(mysql -u root siara_events -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ "$TABLE_COUNT" -lt 2 ]; then
    echo "   ⚠️  Database tables missing - running setup..."
    cd backend
    node database/setup.js 2>&1 | tail -5
    node database/setup-cms.js 2>&1 | tail -5
    cd ..
else
    echo "   ✅ Database tables exist"
fi

# Step 7: Test backend connection
echo ""
echo "7️⃣ Testing backend database connection..."
cd backend
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME
    });
    console.log('   ✅ Backend can connect to database!');
    await connection.end();
  } catch (error) {
    console.log('   ❌ Backend connection failed:', error.message);
    process.exit(1);
  }
})();
" 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "8️⃣ Restarting backend with PM2..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    pm2 delete siara-backend 2>/dev/null
    pm2 start ecosystem.config.js --only siara-backend
    sleep 5
    
    echo ""
    echo "9️⃣ Checking backend status..."
    pm2 status siara-backend
    
    echo ""
    echo "🔟 Testing API..."
    if curl -s http://localhost:5000/api/health > /dev/null; then
        echo "   ✅ Backend API is working!"
        curl -s http://localhost:5000/api/health | head -3
    else
        echo "   ⚠️  Backend started but API not responding yet"
        echo "   Check logs: pm2 logs siara-backend"
    fi
else
    echo ""
    echo "❌ Database connection test failed. Please check .env file."
fi

echo ""
echo "================================="
echo "✅ Fix Complete!"
echo ""
echo "📊 PM2 Status:"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
pm2 status

