#!/bin/bash

echo "=========================================="
echo "  Build and Start Frontend"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. Checking Node.js..."
node -v || { echo "❌ Node.js not found!"; exit 1; }
npm -v || { echo "❌ NPM not found!"; exit 1; }

echo ""
echo "2. Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies missing, installing..."
    npm install
else
    echo "✅ Dependencies exist"
fi

echo ""
echo "3. Checking .env file..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Creating from template..."
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
    echo "✅ Created .env file"
else
    echo "✅ .env file exists"
    # Ensure NEXT_PUBLIC_API_URL is set
    if ! grep -q "NEXT_PUBLIC_API_URL" .env; then
        echo "NEXT_PUBLIC_API_URL=http://170.64.205.179:5000" >> .env
        echo "✅ Added NEXT_PUBLIC_API_URL"
    fi
fi

echo ""
echo "4. Building frontend..."
echo "   This may take a few minutes..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    echo "   Check the error messages above"
    exit 1
fi

echo ""
echo "5. Verifying build..."
if [ -d ".next" ]; then
    echo "✅ Build successful!"
    ls -lh .next | head -3
else
    echo "❌ Build directory not found!"
    exit 1
fi

echo ""
echo "6. Stopping old frontend process..."
pm2 delete siara-frontend 2>/dev/null

echo ""
echo "7. Starting frontend with PM2..."
pm2 start ecosystem.config.js --only siara-frontend
sleep 5

echo ""
echo "8. Checking frontend status..."
pm2 status siara-frontend

echo ""
echo "9. Testing frontend..."
sleep 3
FRONTEND_TEST=$(curl -s -I http://localhost:3000 2>&1 | head -1)
if [[ "$FRONTEND_TEST" == *"200"* ]] || [[ "$FRONTEND_TEST" == *"HTTP"* ]]; then
    echo "✅ Frontend is responding!"
    echo "   $FRONTEND_TEST"
else
    echo "⚠️  Frontend test: $FRONTEND_TEST"
    echo "   Checking logs..."
    pm2 logs siara-frontend --lines 10 --nostream
fi

echo ""
echo "=========================================="
echo "Build and Start Complete!"
echo "=========================================="
echo ""
echo "Frontend URL: http://170.64.205.179:3000"
echo ""
echo "If frontend is still not accessible:"
echo "  1. Check logs: pm2 logs siara-frontend"
echo "  2. Check port: netstat -tulpn | grep 3000"
echo "  3. Check firewall: sudo ufw status"
echo ""

