#!/bin/bash
# Fix backend server - Database connection issue

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🔧 Fixing Backend Server..."
echo "============================"
echo ""

# Step 1: Check MySQL
echo "1️⃣ Checking MySQL..."
if command -v mysql &> /dev/null; then
    echo "   ✅ MySQL installed"
    
    # Try to connect
    if mysql -u root -e "SHOW DATABASES;" 2>/dev/null; then
        echo "   ✅ MySQL accessible without password"
        # Ensure DB_PASSWORD is empty in .env
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env
    else
        echo "   ⚠️  MySQL needs password or not running"
        echo "   Trying to start MySQL..."
        sudo systemctl start mysql 2>/dev/null || echo "   Cannot start MySQL"
        
        # Try again
        if mysql -u root -e "SHOW DATABASES;" 2>/dev/null; then
            echo "   ✅ MySQL now accessible"
            sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env
        else
            echo "   ❌ MySQL still not accessible"
            echo "   Please set MySQL password in .env manually"
        fi
    fi
else
    echo "   ❌ MySQL not installed"
    echo "   Install with: sudo apt install mysql-server -y"
fi

# Step 2: Create database
echo ""
echo "2️⃣ Creating database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>/dev/null && echo "   ✅ Database ready" || echo "   ⚠️  Cannot create database"

# Step 3: Update .env files
echo ""
echo "3️⃣ Updating .env files..."
cp .env backend/.env
echo "   ✅ .env files synced"

# Step 4: Check if database tables exist
echo ""
echo "4️⃣ Checking database tables..."
TABLES=$(mysql -u root siara_events -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ "$TABLES" -gt 1 ]; then
    echo "   ✅ Database tables exist ($TABLES tables)"
else
    echo "   ⚠️  Database tables missing - running setup..."
    cd backend
    node database/setup.js 2>&1 | tail -3
    node database/setup-cms.js 2>&1 | tail -3
    cd ..
fi

# Step 5: Restart backend
echo ""
echo "5️⃣ Restarting backend..."
pm2 delete siara-backend 2>/dev/null
pm2 start ecosystem.config.js --only siara-backend
sleep 5

# Step 6: Check backend
echo ""
echo "6️⃣ Checking backend status..."
pm2 status siara-backend

echo ""
echo "7️⃣ Testing API..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "   ✅ Backend is responding!"
    curl -s http://localhost:5000/api/health | head -5
else
    echo "   ❌ Backend still not responding"
    echo ""
    echo "   📋 Recent error logs:"
    pm2 logs siara-backend --lines 10 --nostream --err
fi

echo ""
echo "============================"
echo "✅ Fix Complete!"
echo ""
echo "🌐 Test URL:"
echo "   http://170.64.205.179:5000/api/health"
echo "   http://170.64.205.179:5000/api/cms/services"

