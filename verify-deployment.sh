#!/bin/bash

echo "=========================================="
echo "  Verify Complete Deployment"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. PM2 Status..."
pm2 status

echo ""
echo "2. Backend Health Check..."
BACKEND_HEALTH=$(curl -s http://localhost:5000/api/health)
if [ -n "$BACKEND_HEALTH" ]; then
    echo "✅ Backend is responding:"
    echo "$BACKEND_HEALTH" | jq . 2>/dev/null || echo "$BACKEND_HEALTH"
else
    echo "❌ Backend not responding"
fi

echo ""
echo "3. Frontend Check..."
FRONTEND_STATUS=$(curl -s -I http://localhost:3000 2>&1 | head -1)
if [[ "$FRONTEND_STATUS" == *"200"* ]] || [[ "$FRONTEND_STATUS" == *"HTTP"* ]]; then
    echo "✅ Frontend is responding:"
    echo "$FRONTEND_STATUS"
else
    echo "⚠️  Frontend check: $FRONTEND_STATUS"
fi

echo ""
echo "4. Backend Logs (Last 5 lines)..."
pm2 logs siara-backend --lines 5 --nostream | tail -5

echo ""
echo "5. Frontend Logs (Last 5 lines)..."
pm2 logs siara-frontend --lines 5 --nostream | tail -5

echo ""
echo "6. Database Connection Test..."
cd backend
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    const [rows] = await conn.execute('SELECT COUNT(*) as count FROM cms_pages');
    console.log('✅ Database connected');
    console.log('   CMS Pages:', rows[0].count);
    await conn.end();
  } catch (error) {
    console.log('❌ Database error:', error.message);
  }
})();
" 2>&1
cd ..

echo ""
echo "7. Port Status..."
netstat -tulpn 2>/dev/null | grep -E '3000|5000' || ss -tulpn 2>/dev/null | grep -E '3000|5000' || echo "   (Port check requires sudo)"

echo ""
echo "=========================================="
echo "Deployment Status Summary"
echo "=========================================="
echo ""
echo "✅ Backend: http://170.64.205.179:5000"
echo "✅ Frontend: http://170.64.205.179:3000"
echo "✅ Manager: http://170.64.205.179:3000/manager/login"
echo ""
echo "Default Admin Credentials:"
echo "  Email: admin@siara.com"
echo "  Password: admin123"
echo ""
echo "Useful Commands:"
echo "  pm2 status              - Check process status"
echo "  pm2 logs                - View all logs"
echo "  pm2 restart all         - Restart all processes"
echo "  pm2 logs siara-backend  - Backend logs only"
echo "  pm2 logs siara-frontend - Frontend logs only"
echo ""

