#!/bin/bash

echo "=========================================="
echo "  Check Frontend Status"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. PM2 Status..."
pm2 status

echo ""
echo "2. Frontend Process Check..."
FRONTEND_STATUS=$(pm2 jlist | grep -A 10 "siara-frontend" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
echo "   Status: $FRONTEND_STATUS"

FRONTEND_RESTARTS=$(pm2 jlist | grep -A 10 "siara-frontend" | grep -o '"restart_time":[0-9]*' | cut -d: -f2)
echo "   Restarts: $FRONTEND_RESTARTS"

if [ "$FRONTEND_RESTARTS" -gt 10 ]; then
    echo "   ⚠️  High restart count - frontend may be crashing"
fi

echo ""
echo "3. Frontend Logs (Last 20 lines)..."
pm2 logs siara-frontend --lines 20 --nostream

echo ""
echo "4. Testing Frontend Locally..."
LOCAL_TEST=$(curl -s -I http://localhost:3000 2>&1 | head -1)
if [[ "$LOCAL_TEST" == *"200"* ]] || [[ "$LOCAL_TEST" == *"HTTP"* ]]; then
    echo "✅ Frontend responding on localhost:3000"
    echo "   $LOCAL_TEST"
else
    echo "❌ Frontend not responding on localhost:3000"
    echo "   Response: $LOCAL_TEST"
fi

echo ""
echo "5. Checking if .next build exists..."
if [ -d ".next" ]; then
    echo "✅ Frontend build exists"
    ls -lh .next | head -5
else
    echo "❌ Frontend not built!"
    echo "   Run: npm run build"
fi

echo ""
echo "6. Checking Port 3000..."
if command -v netstat &> /dev/null; then
    netstat -tulpn 2>/dev/null | grep :3000 || echo "   Port 3000 not found in netstat"
elif command -v ss &> /dev/null; then
    ss -tulpn 2>/dev/null | grep :3000 || echo "   Port 3000 not found in ss"
else
    echo "   (netstat/ss not available)"
fi

echo ""
echo "7. Testing External Access..."
EXTERNAL_TEST=$(curl -s -I http://170.64.205.179:3000 --max-time 5 2>&1 | head -1)
if [[ "$EXTERNAL_TEST" == *"200"* ]] || [[ "$EXTERNAL_TEST" == *"HTTP"* ]]; then
    echo "✅ Frontend accessible externally"
    echo "   $EXTERNAL_TEST"
else
    echo "⚠️  External access test: $EXTERNAL_TEST"
    echo "   (This might be normal if firewall blocks external access)"
fi

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "Frontend URL: http://170.64.205.179:3000"
echo ""
echo "If frontend is not accessible:"
echo "  1. Check PM2 status: pm2 status"
echo "  2. Check logs: pm2 logs siara-frontend"
echo "  3. Rebuild if needed: npm run build"
echo "  4. Restart: pm2 restart siara-frontend"
echo "  5. Check firewall: sudo ufw status (if using ufw)"
echo ""

