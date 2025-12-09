#!/bin/bash

echo "=========================================="
echo "  Fix Frontend Not Opening"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. Checking PM2 Status..."
pm2 status

echo ""
echo "2. Checking Frontend Process..."
FRONTEND_STATUS=$(pm2 jlist | grep -A 10 "siara-frontend" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
FRONTEND_RESTARTS=$(pm2 jlist | grep -A 10 "siara-frontend" | grep -o '"restart_time":[0-9]*' | cut -d: -f2)

echo "   Status: $FRONTEND_STATUS"
echo "   Restarts: $FRONTEND_RESTARTS"

if [ "$FRONTEND_STATUS" != "online" ] || [ "$FRONTEND_RESTARTS" -gt 10 ]; then
    echo "   ⚠️  Frontend is not running properly"
    echo ""
    echo "   Checking logs..."
    pm2 logs siara-frontend --lines 20 --nostream
fi

echo ""
echo "3. Checking if Frontend is Built..."
if [ ! -d ".next" ]; then
    echo "❌ Frontend not built!"
    echo "   Building now..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
else
    echo "✅ Frontend build exists"
fi

echo ""
echo "4. Checking .env Configuration..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found! Creating..."
    cat > .env <<EOF
DB_HOST=127.0.0.1
DB_USER=siara_user
DB_PASSWORD=siara_password_2024
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=siara_events_super_secret_jwt_key_2024_change_this_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://170.64.205.179:3000
NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
EOF
fi

# Ensure NEXT_PUBLIC_API_URL is set
if ! grep -q "NEXT_PUBLIC_API_URL" .env; then
    echo "   Adding NEXT_PUBLIC_API_URL..."
    echo "NEXT_PUBLIC_API_URL=http://170.64.205.179:5000" >> .env
fi

echo "✅ .env configured"

echo ""
echo "5. Stopping and Restarting Frontend..."
pm2 delete siara-frontend 2>/dev/null
sleep 2

# Rebuild if needed (to include new env vars)
if [ -d ".next" ]; then
    echo "   Rebuilding to include environment variables..."
    npm run build
fi

# Start frontend
pm2 start ecosystem.config.js --only siara-frontend
sleep 5

echo ""
echo "6. Checking Frontend Status..."
pm2 status siara-frontend
pm2 logs siara-frontend --lines 10 --nostream

echo ""
echo "7. Testing Local Connection..."
LOCAL_TEST=$(curl -s -I http://localhost:3000 2>&1 | head -1)
if [[ "$LOCAL_TEST" == *"200"* ]] || [[ "$LOCAL_TEST" == *"HTTP"* ]]; then
    echo "✅ Frontend responding on localhost:3000"
else
    echo "❌ Frontend not responding on localhost"
    echo "   Response: $LOCAL_TEST"
    echo ""
    echo "   Checking for errors..."
    pm2 logs siara-frontend --lines 30 --nostream
fi

echo ""
echo "8. Checking Port 3000..."
if command -v netstat &> /dev/null; then
    PORT_CHECK=$(netstat -tulpn 2>/dev/null | grep :3000)
    if [ -n "$PORT_CHECK" ]; then
        echo "✅ Port 3000 is listening:"
        echo "$PORT_CHECK"
    else
        echo "❌ Port 3000 is not listening"
    fi
elif command -v ss &> /dev/null; then
    PORT_CHECK=$(ss -tulpn 2>/dev/null | grep :3000)
    if [ -n "$PORT_CHECK" ]; then
        echo "✅ Port 3000 is listening:"
        echo "$PORT_CHECK"
    else
        echo "❌ Port 3000 is not listening"
    fi
fi

echo ""
echo "9. Checking Firewall (if accessible)..."
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status 2>/dev/null | grep -i "3000" || echo "Port 3000 not in firewall rules")
    echo "   Firewall status: $UFW_STATUS"
    if [[ "$UFW_STATUS" != *"3000"* ]]; then
        echo "   ⚠️  Port 3000 might not be open in firewall"
        echo "   To open: sudo ufw allow 3000/tcp"
    fi
fi

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "Frontend URL: http://170.64.205.179:3000"
echo ""
echo "If still not accessible:"
echo "  1. Check if port 3000 is open in firewall:"
echo "     sudo ufw status"
echo "     sudo ufw allow 3000/tcp"
echo ""
echo "  2. Check if server allows external connections"
echo "     (Some servers block external access to certain ports)"
echo ""
echo "  3. Check PM2 logs for errors:"
echo "     pm2 logs siara-frontend --lines 50"
echo ""
echo "  4. Try accessing from server itself:"
echo "     curl http://localhost:3000"
echo ""

