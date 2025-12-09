#!/bin/bash
# Complete fix for network error

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🔧 Complete Fix for Network Error"
echo "=================================="
echo ""

# Step 1: Fix MySQL password
echo "1️⃣ Fixing MySQL connection..."
echo "   Trying to connect without password..."

if mysql -u root -e "SHOW DATABASES;" 2>/dev/null; then
    echo "   ✅ MySQL accessible without password"
    # Update .env
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env
else
    echo "   ⚠️  MySQL needs password"
    echo "   Please set DB_PASSWORD in .env manually"
fi

# Step 2: Create database
echo ""
echo "2️⃣ Creating database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>/dev/null && echo "   ✅ Database ready" || echo "   ⚠️  Cannot create - check MySQL"

# Step 3: Copy .env
echo ""
echo "3️⃣ Updating .env files..."
cp .env backend/.env
echo "   ✅ .env files updated"

# Step 4: Restart backend
echo ""
echo "4️⃣ Restarting backend..."
pm2 restart siara-backend
sleep 3

# Step 5: Check backend
echo ""
echo "5️⃣ Checking backend..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "   ✅ Backend is running!"
    curl -s http://localhost:5000/api/health | head -3
else
    echo "   ❌ Backend still not responding"
    echo "   📋 Backend logs:"
    pm2 logs siara-backend --lines 5 --nostream
fi

# Step 6: Rebuild frontend
echo ""
echo "6️⃣ Rebuilding frontend with correct API URL..."
export $(cat .env | grep -v '^#' | xargs)
npm run build 2>&1 | tail -5

# Step 7: Restart frontend
echo ""
echo "7️⃣ Restarting frontend..."
pm2 restart siara-frontend

echo ""
echo "=================================="
echo "✅ Fix Complete!"
echo ""
echo "📊 Final Status:"
pm2 status

echo ""
echo "🌐 Test URLs:"
echo "   Frontend: http://170.64.205.179:3000"
echo "   Backend: http://170.64.205.179:5000/api/health"
echo "   Manager: http://170.64.205.179:3000/manager/login"

