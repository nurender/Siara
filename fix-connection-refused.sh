#!/bin/bash

echo "=========================================="
echo "  Fix Connection Refused Error"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. Checking PM2 Processes..."
pm2 status

echo ""
echo "2. Checking if services are listening..."
echo "   Port 5000 (Backend):"
if command -v netstat &> /dev/null; then
    netstat -tulpn 2>/dev/null | grep :5000 || echo "   ❌ Not listening on port 5000"
elif command -v ss &> /dev/null; then
    ss -tulpn 2>/dev/null | grep :5000 || echo "   ❌ Not listening on port 5000"
else
    echo "   (netstat/ss not available)"
fi

echo "   Port 3000 (Frontend):"
if command -v netstat &> /dev/null; then
    netstat -tulpn 2>/dev/null | grep :3000 || echo "   ❌ Not listening on port 3000"
elif command -v ss &> /dev/null; then
    ss -tulpn 2>/dev/null | grep :3000 || echo "   ❌ Not listening on port 3000"
else
    echo "   (netstat/ss not available)"
fi

echo ""
echo "3. Testing local connections..."
echo "   Backend (localhost:5000):"
BACKEND_TEST=$(curl -s -I http://localhost:5000/api/health 2>&1 | head -1)
if [[ "$BACKEND_TEST" == *"200"* ]] || [[ "$BACKEND_TEST" == *"HTTP"* ]]; then
    echo "   ✅ Backend responding locally"
else
    echo "   ❌ Backend not responding: $BACKEND_TEST"
    echo "   Checking backend logs..."
    pm2 logs siara-backend --lines 10 --nostream
fi

echo "   Frontend (localhost:3000):"
FRONTEND_TEST=$(curl -s -I http://localhost:3000 2>&1 | head -1)
if [[ "$FRONTEND_TEST" == *"200"* ]] || [[ "$FRONTEND_TEST" == *"HTTP"* ]]; then
    echo "   ✅ Frontend responding locally"
else
    echo "   ❌ Frontend not responding: $FRONTEND_TEST"
    echo "   Checking frontend logs..."
    pm2 logs siara-frontend --lines 10 --nostream
fi

echo ""
echo "4. Checking Firewall..."
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status 2>/dev/null)
    echo "   UFW Status:"
    echo "$UFW_STATUS" | head -5
    
    if echo "$UFW_STATUS" | grep -q "Status: active"; then
        echo ""
        echo "   ⚠️  UFW is active, checking ports..."
        if ! echo "$UFW_STATUS" | grep -q "3000"; then
            echo "   Opening port 3000..."
            sudo ufw allow 3000/tcp
        fi
        if ! echo "$UFW_STATUS" | grep -q "5000"; then
            echo "   Opening port 5000..."
            sudo ufw allow 5000/tcp
        fi
        sudo ufw reload
        echo "   ✅ Firewall updated"
    fi
elif command -v firewall-cmd &> /dev/null; then
    echo "   Checking firewalld..."
    sudo firewall-cmd --list-ports 2>/dev/null
    sudo firewall-cmd --permanent --add-port=3000/tcp 2>/dev/null
    sudo firewall-cmd --permanent --add-port=5000/tcp 2>/dev/null
    sudo firewall-cmd --reload 2>/dev/null
    echo "   ✅ Firewall updated"
else
    echo "   (No firewall detected or requires manual configuration)"
fi

echo ""
echo "5. Checking if services need restart..."
BACKEND_STATUS=$(pm2 jlist | grep -A 5 "siara-backend" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
FRONTEND_STATUS=$(pm2 jlist | grep -A 5 "siara-frontend" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$BACKEND_STATUS" != "online" ]; then
    echo "   ⚠️  Backend not online, restarting..."
    pm2 restart siara-backend
    sleep 3
fi

if [ "$FRONTEND_STATUS" != "online" ]; then
    echo "   ⚠️  Frontend not online, restarting..."
    pm2 restart siara-frontend
    sleep 3
fi

echo ""
echo "6. Checking if frontend is built..."
if [ ! -d ".next" ]; then
    echo "   ❌ Frontend not built!"
    echo "   Building frontend..."
    npm run build
    pm2 restart siara-frontend
    sleep 3
else
    echo "   ✅ Frontend build exists"
fi

echo ""
echo "7. Final Status Check..."
pm2 status

echo ""
echo "8. Testing services again..."
sleep 2
echo "   Backend:"
curl -s http://localhost:5000/api/health && echo "" || echo "   ❌ Still not responding"

echo "   Frontend:"
curl -s -I http://localhost:3000 | head -1 || echo "   ❌ Still not responding"

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "If still getting connection refused:"
echo ""
echo "1. Check if services are running:"
echo "   pm2 status"
echo ""
echo "2. Check if ports are listening:"
echo "   netstat -tulpn | grep -E '3000|5000'"
echo "   or"
echo "   ss -tulpn | grep -E '3000|5000'"
echo ""
echo "3. Check firewall:"
echo "   sudo ufw status"
echo "   sudo ufw allow 3000/tcp"
echo "   sudo ufw allow 5000/tcp"
echo ""
echo "4. Check if server allows external connections:"
echo "   (Some cloud providers block ports by default)"
echo "   - Check cloud provider firewall/security groups"
echo "   - Ensure ports 3000 and 5000 are open"
echo ""
echo "5. Check server network configuration:"
echo "   ip addr show"
echo "   (Ensure server has public IP and is accessible)"
echo ""

