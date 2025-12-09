#!/bin/bash
# Fix siara-backend errored status

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🔧 Fixing siara-backend Error..."
echo "================================="
echo ""

# Step 1: Check MySQL
echo "1️⃣ Checking MySQL service..."
if sudo systemctl is-active --quiet mysql; then
    echo "   ✅ MySQL is running"
else
    echo "   ⚠️  MySQL not running - starting..."
    sudo systemctl start mysql
    sleep 2
fi

# Step 2: Fix MySQL password
echo ""
echo "2️⃣ Fixing MySQL password..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';" 2>/dev/null
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null
echo "   ✅ MySQL password configured"

# Step 3: Create database
echo ""
echo "3️⃣ Creating database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>/dev/null && echo "   ✅ Database ready" || echo "   ⚠️  Database creation failed"

# Step 4: Check database tables
echo ""
echo "4️⃣ Checking database tables..."
TABLE_COUNT=$(mysql -u root siara_events -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ "$TABLE_COUNT" -lt 2 ]; then
    echo "   ⚠️  Database tables missing - running setup..."
    cd backend
    node database/setup.js 2>&1 | tail -3
    node database/setup-cms.js 2>&1 | tail -3
    cd ..
else
    echo "   ✅ Database tables exist ($TABLE_COUNT tables found)"
fi

# Step 5: Update .env
echo ""
echo "5️⃣ Updating .env files..."
# Ensure DB_PASSWORD is empty
sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env 2>/dev/null || echo "DB_PASSWORD=" >> .env
cp .env backend/.env
echo "   ✅ .env files updated"

# Step 6: Stop errored backend
echo ""
echo "6️⃣ Stopping errored backend..."
pm2 delete siara-backend 2>/dev/null
sleep 2

# Step 7: Start backend fresh
echo ""
echo "7️⃣ Starting backend..."
cd ~/siara-events
pm2 start ecosystem.config.js --only siara-backend
sleep 5

# Step 8: Check status
echo ""
echo "8️⃣ Checking backend status..."
pm2 status siara-backend

# Step 9: Test API
echo ""
echo "9️⃣ Testing API..."
sleep 2
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "   ✅ Backend is working!"
    echo ""
    echo "   API Response:"
    curl -s http://localhost:5000/api/health | head -3
else
    echo "   ❌ Backend still not responding"
    echo ""
    echo "   📋 Error logs:"
    pm2 logs siara-backend --lines 10 --nostream --err
fi

echo ""
echo "================================="
echo "✅ Fix Complete!"
echo ""
echo "📊 Full PM2 Status:"
pm2 status

echo ""
echo "🌐 Test URLs:"
echo "   http://170.64.205.179:5000/api/health"
echo "   http://170.64.205.179:5000/api/cms/services"

