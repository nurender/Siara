#!/bin/bash

echo "=========================================="
echo "  Restart PM2 Services"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM (if using NVM)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 2>/dev/null

echo "1. Checking PM2 status..."
pm2 status

echo ""
echo "2. Stopping all PM2 processes..."
pm2 stop all
sleep 2

echo ""
echo "3. Deleting all PM2 processes..."
pm2 delete all
sleep 2

echo ""
echo "4. Starting services from ecosystem.config.js..."
pm2 start ecosystem.config.js

echo ""
echo "5. Waiting for services to start..."
sleep 5

echo ""
echo "6. Checking PM2 status..."
pm2 status

echo ""
echo "7. Saving PM2 configuration..."
pm2 save

echo ""
echo "8. Setting PM2 to start on boot..."
pm2 startup
echo ""
echo "   ⚠️  Run the command shown above as root/sudo if you want auto-start on boot"

echo ""
echo "9. Checking backend (port 5000)..."
sleep 2
BACKEND_TEST=$(curl -s -I http://localhost:5000/api/health 2>&1 | head -1)
if [[ "$BACKEND_TEST" == *"200"* ]] || [[ "$BACKEND_TEST" == *"404"* ]] || [[ "$BACKEND_TEST" == *"HTTP"* ]]; then
    echo "   ✅ Backend is responding!"
else
    echo "   ⚠️  Backend test: $BACKEND_TEST"
    echo "   Checking backend logs..."
    pm2 logs siara-backend --lines 10 --nostream
fi

echo ""
echo "10. Checking frontend (port 3000)..."
sleep 2
FRONTEND_TEST=$(curl -s -I http://localhost:3000 2>&1 | head -1)
if [[ "$FRONTEND_TEST" == *"200"* ]] || [[ "$FRONTEND_TEST" == *"HTTP"* ]]; then
    echo "   ✅ Frontend is responding!"
else
    echo "   ⚠️  Frontend test: $FRONTEND_TEST"
    echo "   Checking frontend logs..."
    pm2 logs siara-frontend --lines 10 --nostream
fi

echo ""
echo "=========================================="
echo "PM2 Restart Complete!"
echo "=========================================="
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check status"
echo "  pm2 logs            - View all logs"
echo "  pm2 logs siara-backend --lines 50  - Backend logs"
echo "  pm2 logs siara-frontend --lines 50 - Frontend logs"
echo "  pm2 restart all     - Restart all"
echo "  pm2 stop all        - Stop all"
echo ""

