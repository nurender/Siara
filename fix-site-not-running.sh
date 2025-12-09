#!/bin/bash

echo "=========================================="
echo "  Siara Site Fix - Complete Check & Fix"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. Checking PM2 Status..."
pm2 status

echo ""
echo "2. Checking MySQL Connection..."
mysql -u root -e "SELECT 1;" 2>&1
if [ $? -ne 0 ]; then
    echo "❌ MySQL connection failed!"
    echo "   Trying to fix MySQL..."
    
    # Try to start MySQL
    sudo systemctl start mysql 2>/dev/null || echo "   Could not start MySQL (need sudo password)"
    
    # Test again
    mysql -u root -e "SELECT 1;" 2>&1
    if [ $? -ne 0 ]; then
        echo "   ⚠️  MySQL still not working. Check FIX_ROOT_ACCESS_DENIED.md"
    else
        echo "   ✅ MySQL fixed!"
    fi
else
    echo "✅ MySQL connection OK"
fi

echo ""
echo "3. Checking Database..."
mysql -u root -e "USE siara_events; SHOW TABLES;" 2>&1 | head -5
if [ $? -ne 0 ]; then
    echo "❌ Database not found or tables missing!"
    echo "   Creating database..."
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>&1
    
    echo "   Setting up tables..."
    cd backend
    node database/setup.js 2>&1 | tail -3
    node database/setup-cms.js 2>&1 | tail -3
    cd ..
    echo "   ✅ Database setup complete"
else
    echo "✅ Database exists"
fi

echo ""
echo "4. Checking Backend .env..."
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env exists"
    grep -q "DB_PASSWORD" backend/.env && echo "   DB_PASSWORD configured"
    grep -q "JWT_SECRET" backend/.env && echo "   JWT_SECRET configured"
    grep -q "JWT_EXPIRES_IN" backend/.env && echo "   JWT_EXPIRES_IN configured" || echo "   ⚠️  JWT_EXPIRES_IN missing!"
else
    echo "❌ Backend .env missing!"
    if [ -f ".env" ]; then
        echo "   Copying root .env to backend..."
        cp .env backend/.env
        echo "   ✅ Copied"
    fi
fi

echo ""
echo "5. Restarting Backend..."
pm2 delete siara-backend 2>/dev/null
pm2 start ecosystem.config.js --only siara-backend
sleep 3

echo ""
echo "6. Checking Backend Status..."
pm2 status siara-backend
pm2 logs siara-backend --lines 5 --nostream

echo ""
echo "7. Testing Backend API..."
curl -s http://localhost:5000/api/health || echo "❌ Backend not responding"

echo ""
echo "8. Checking Frontend..."
if [ -d ".next" ]; then
    echo "✅ Frontend build exists"
else
    echo "❌ Frontend not built!"
    echo "   Building frontend..."
    npm run build
fi

echo ""
echo "9. Restarting Frontend..."
pm2 delete siara-frontend 2>/dev/null
pm2 start ecosystem.config.js --only siara-frontend
sleep 3

echo ""
echo "10. Final Status Check..."
pm2 status

echo ""
echo "11. Testing Frontend..."
curl -s -I http://localhost:3000 | head -1 || echo "❌ Frontend not responding"

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "Check these URLs:"
echo "  Frontend: http://170.64.205.179:3000"
echo "  Backend:  http://170.64.205.179:5000/api/health"
echo ""
echo "If still not working, check logs:"
echo "  pm2 logs siara-backend"
echo "  pm2 logs siara-frontend"

