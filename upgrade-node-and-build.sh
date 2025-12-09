#!/bin/bash

echo "=========================================="
echo "  Upgrade Node.js and Build Frontend"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. Current Node.js version..."
CURRENT_NODE=$(node -v)
echo "   Current: $CURRENT_NODE"

REQUIRED_VERSION="20.9.0"
echo "   Required: >= $REQUIRED_VERSION"

echo ""
echo "2. Installing Node.js 20..."
nvm install 20
nvm use 20
nvm alias default 20

echo ""
echo "3. Verifying Node.js version..."
NEW_NODE=$(node -v)
echo "   New version: $NEW_NODE"

# Check if version is >= 20.9.0
NODE_MAJOR=$(echo $NEW_NODE | cut -d'v' -f2 | cut -d'.' -f1)
NODE_MINOR=$(echo $NEW_NODE | cut -d'v' -f2 | cut -d'.' -f2)

if [ "$NODE_MAJOR" -lt 20 ] || ([ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 9 ]); then
    echo "   ⚠️  Version might still be too old, trying latest 20.x..."
    nvm install 20 --latest-npm
    nvm use 20
    nvm alias default 20
    NEW_NODE=$(node -v)
    echo "   Updated to: $NEW_NODE"
fi

echo ""
echo "4. Verifying NPM version..."
npm -v

echo ""
echo "5. Reinstalling PM2 with new Node version..."
npm install -g pm2
pm2 --version

echo ""
echo "6. Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "   ✅ Dependencies exist"
fi

echo ""
echo "7. Building frontend..."
echo "   This may take 2-5 minutes..."
npm run build

if [ $? -ne 0 ]; then
    echo "   ❌ Build failed!"
    echo "   Check the error messages above"
    exit 1
fi

echo ""
echo "8. Verifying build..."
if [ -d ".next" ]; then
    echo "   ✅ Build successful!"
    ls -lh .next | head -3
else
    echo "   ❌ Build directory not found!"
    exit 1
fi

echo ""
echo "9. Starting frontend with PM2..."
pm2 delete siara-frontend 2>/dev/null
sleep 2

# Ensure NVM is loaded in PM2 context
pm2 start ecosystem.config.js --only siara-frontend --update-env
sleep 5

echo ""
echo "10. Checking frontend status..."
pm2 status siara-frontend
pm2 logs siara-frontend --lines 10 --nostream

echo ""
echo "11. Testing frontend..."
sleep 3
FRONTEND_TEST=$(curl -s -I http://localhost:3000 2>&1 | head -1)
if [[ "$FRONTEND_TEST" == *"200"* ]] || [[ "$FRONTEND_TEST" == *"HTTP"* ]]; then
    echo "   ✅ Frontend is responding!"
    echo "   $FRONTEND_TEST"
else
    echo "   ⚠️  Frontend test: $FRONTEND_TEST"
    echo "   Checking logs..."
    pm2 logs siara-frontend --lines 20 --nostream
fi

echo ""
echo "=========================================="
echo "Upgrade and Build Complete!"
echo "=========================================="
echo ""
echo "Node.js version: $(node -v)"
echo "Frontend URL: http://170.64.205.179:3000"
echo ""
echo "If frontend still not working:"
echo "  pm2 logs siara-frontend --lines 50"
echo ""

