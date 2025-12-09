#!/bin/bash

echo "=========================================="
echo "  Fix Restarting Processes"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. Stopping all processes..."
pm2 delete all 2>/dev/null
sleep 2

echo ""
echo "2. Checking Backend Logs for Errors..."
if [ -f "logs/backend-error.log" ]; then
    echo "   Last 20 lines of backend-error.log:"
    tail -20 logs/backend-error.log
fi

echo ""
echo "3. Checking Backend Configuration..."
cd backend
if [ ! -f ".env" ]; then
    echo "❌ backend/.env not found!"
    echo "   Creating from root .env..."
    if [ -f "../.env" ]; then
        cp ../.env .env
        echo "✅ Created .env"
    else
        echo "❌ Root .env also not found!"
        exit 1
    fi
else
    echo "✅ backend/.env exists"
    # Check required variables
    if ! grep -q "JWT_EXPIRES_IN" .env; then
        echo "   Adding JWT_EXPIRES_IN..."
        echo "JWT_EXPIRES_IN=7d" >> .env
    fi
    if ! grep -q "DB_NAME" .env; then
        echo "   Adding DB_NAME..."
        echo "DB_NAME=siara_events" >> .env
    fi
fi
cd ..

echo ""
echo "4. Testing Database Connection..."
cd backend
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'siara_events'
    });
    console.log('✅ Database connection OK');
    await conn.end();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    process.exit(1);
  }
})();
" || {
    echo "❌ Database connection test failed!"
    echo "   Please check backend/.env file"
    exit 1
}
cd ..

echo ""
echo "5. Checking Dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies missing, installing..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "node_modules" ]; then
    echo "⚠️  Frontend dependencies missing, installing..."
    npm install
fi

echo ""
echo "6. Checking if .next build exists..."
if [ ! -d ".next" ]; then
    echo "⚠️  Frontend not built, building now..."
    npm run build
fi

echo ""
echo "7. Starting Backend (with error checking)..."
pm2 start ecosystem.config.js --only siara-backend
sleep 5

# Check if backend is still running
BACKEND_RESTARTS=$(pm2 jlist | grep -A 5 "siara-backend" | grep -o '"restart_time":[0-9]*' | cut -d: -f2)
if [ "$BACKEND_RESTARTS" -gt 0 ]; then
    echo "❌ Backend is restarting! Checking logs..."
    pm2 logs siara-backend --lines 30 --nostream
    echo ""
    echo "Common fixes:"
    echo "  1. Check backend/.env - all variables must be set"
    echo "  2. Check database connection"
    echo "  3. Check backend/server.js for errors"
    exit 1
fi

echo "✅ Backend started successfully"

echo ""
echo "8. Starting Frontend..."
pm2 start ecosystem.config.js --only siara-frontend
sleep 5

# Check if frontend is still running
FRONTEND_RESTARTS=$(pm2 jlist | grep -A 5 "siara-frontend" | grep -o '"restart_time":[0-9]*' | cut -d: -f2)
if [ "$FRONTEND_RESTARTS" -gt 0 ]; then
    echo "❌ Frontend is restarting! Checking logs..."
    pm2 logs siara-frontend --lines 30 --nostream
    echo ""
    echo "Common fixes:"
    echo "  1. Check if .next build exists"
    echo "  2. Check if port 3000 is available"
    echo "  3. Run: npm run build"
    exit 1
fi

echo "✅ Frontend started successfully"

echo ""
echo "9. Final Status..."
pm2 status

echo ""
echo "10. Testing APIs..."
echo "   Backend:"
sleep 2
curl -s http://localhost:5000/api/health && echo "" || echo "   ⚠️  Backend not responding yet (may need a moment)"
echo "   Frontend:"
curl -s -I http://localhost:3000 | head -1 || echo "   ⚠️  Frontend not responding yet (may need a moment)"

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "If processes are still restarting, check:"
echo "  pm2 logs siara-backend --lines 50"
echo "  pm2 logs siara-frontend --lines 50"
echo ""

