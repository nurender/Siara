#!/bin/bash

echo "=========================================="
echo "  Fix Frontend Not Starting"
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
FRONTEND_STATUS=$(pm2 jlist 2>/dev/null | grep -A 10 "siara-frontend" | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "not_found")
FRONTEND_RESTARTS=$(pm2 jlist 2>/dev/null | grep -A 10 "siara-frontend" | grep -o '"restart_time":[0-9]*' | cut -d: -f2 || echo "0")

echo "   Status: $FRONTEND_STATUS"
echo "   Restarts: $FRONTEND_RESTARTS"

if [ "$FRONTEND_STATUS" != "online" ] || [ "$FRONTEND_RESTARTS" -gt 5 ]; then
    echo "   ⚠️  Frontend is not running properly"
    echo ""
    echo "   Checking logs..."
    pm2 logs siara-frontend --lines 30 --nostream
fi

echo ""
echo "3. Stopping Frontend..."
pm2 delete siara-frontend 2>/dev/null
sleep 2

echo ""
echo "4. Checking Frontend Build..."
if [ ! -d ".next" ]; then
    echo "   ❌ Frontend not built!"
    echo "   Building now (this may take 2-5 minutes)..."
    
    # Check dependencies
    if [ ! -d "node_modules" ]; then
        echo "   Installing dependencies..."
        npm install
    fi
    
    # Build
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "   ❌ Build failed!"
        echo "   Check the error messages above"
        exit 1
    fi
    
    if [ ! -d ".next" ]; then
        echo "   ❌ Build directory still not found!"
        exit 1
    fi
    
    echo "   ✅ Frontend build complete"
else
    echo "   ✅ Frontend build exists"
fi

echo ""
echo "5. Checking .env Configuration..."
if [ ! -f ".env" ]; then
    echo "   ❌ .env file not found! Creating..."
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

echo "   ✅ .env configured"

echo ""
echo "6. Testing if port 3000 is available..."
if command -v netstat &> /dev/null; then
    PORT_IN_USE=$(netstat -tulpn 2>/dev/null | grep :3000)
    if [ -n "$PORT_IN_USE" ]; then
        echo "   ⚠️  Port 3000 is in use:"
        echo "$PORT_IN_USE"
        echo "   Killing process..."
        PID=$(echo "$PORT_IN_USE" | awk '{print $7}' | cut -d'/' -f1)
        if [ -n "$PID" ] && [ "$PID" != "-" ]; then
            kill -9 "$PID" 2>/dev/null
            echo "   ✅ Process killed"
        fi
    else
        echo "   ✅ Port 3000 is available"
    fi
fi

echo ""
echo "7. Starting Frontend with PM2..."
pm2 start ecosystem.config.js --only siara-frontend
sleep 5

echo ""
echo "8. Checking Frontend Status..."
pm2 status siara-frontend
pm2 logs siara-frontend --lines 15 --nostream

echo ""
echo "9. Testing Frontend Connection..."
sleep 3
for i in {1..3}; do
    FRONTEND_TEST=$(curl -s -I http://localhost:3000 2>&1 | head -1)
    if [[ "$FRONTEND_TEST" == *"200"* ]] || [[ "$FRONTEND_TEST" == *"HTTP"* ]]; then
        echo "   ✅ Frontend is responding!"
        echo "   $FRONTEND_TEST"
        break
    else
        echo "   ⏳ Attempt $i: Waiting for frontend to start..."
        sleep 2
    fi
done

if [[ "$FRONTEND_TEST" != *"200"* ]] && [[ "$FRONTEND_TEST" != *"HTTP"* ]]; then
    echo "   ❌ Frontend still not responding"
    echo ""
    echo "   Checking for errors..."
    pm2 logs siara-frontend --lines 50 --nostream
    echo ""
    echo "   Try manually:"
    echo "     cd ~/siara-events"
    echo "     npm run start"
    echo "     (Check for errors in the output)"
fi

echo ""
echo "10. Checking Port Status..."
if command -v netstat &> /dev/null; then
    netstat -tulpn 2>/dev/null | grep :3000 || echo "   ⚠️  Port 3000 not found in netstat"
elif command -v ss &> /dev/null; then
    ss -tulpn 2>/dev/null | grep :3000 || echo "   ⚠️  Port 3000 not found in ss"
fi

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "If frontend is still not working:"
echo "  1. Check logs: pm2 logs siara-frontend --lines 50"
echo "  2. Try manual start: npm run start"
echo "  3. Check if .next folder exists: ls -la .next"
echo "  4. Rebuild if needed: npm run build"
echo ""

