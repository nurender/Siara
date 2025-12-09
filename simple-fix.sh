#!/bin/bash

echo "=========================================="
echo "  Simple Fix - Step by Step"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. Testing Node/NPM..."
node -v || { echo "❌ Node not found!"; exit 1; }
npm -v || { echo "❌ NPM not found!"; exit 1; }
echo "✅ Node/NPM OK"

echo ""
echo "2. Testing PM2..."
pm2 --version 2>&1 || { 
    echo "❌ PM2 not found! Installing...";
    npm install -g pm2;
}
echo "✅ PM2 OK"

echo ""
echo "3. Testing MySQL with siara_user..."
mysql -u siara_user -psiara_password_2024 -e "SELECT 1;" 2>&1
if [ $? -ne 0 ]; then
    echo "❌ MySQL connection failed!"
    echo ""
    echo "Please run this FIRST (needs sudo password):"
    echo "  sudo bash create-mysql-user.sh"
    echo ""
    echo "Or manually:"
    echo "  sudo mysql"
    echo "  CREATE USER IF NOT EXISTS 'siara_user'@'localhost' IDENTIFIED BY 'siara_password_2024';"
    echo "  GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';"
    echo "  FLUSH PRIVILEGES;"
    echo "  EXIT;"
    exit 1
fi
echo "✅ MySQL connection OK"

echo ""
echo "4. Checking backend/.env..."
cd backend
if grep -q "DB_USER=siara_user" .env 2>/dev/null; then
    echo "✅ .env has siara_user"
else
    echo "⚠️  Updating .env..."
    sed -i 's/^DB_USER=.*/DB_USER=siara_user/' .env
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=siara_password_2024/' .env
    echo "✅ .env updated"
fi
cd ..

echo ""
echo "5. Setting up database tables..."
cd backend
if [ -f "database/setup.js" ]; then
    node database/setup.js 2>&1 | tail -3
fi
cd ..

echo ""
echo "6. Starting backend with PM2..."
pm2 delete siara-backend 2>/dev/null
pm2 start ecosystem.config.js --only siara-backend
sleep 5

echo ""
echo "7. Checking backend..."
pm2 status siara-backend
pm2 logs siara-backend --lines 10 --nostream

echo ""
echo "8. Testing backend API..."
curl -s http://localhost:5000/api/health && echo "" || echo "❌ Backend not responding"

echo ""
echo "9. Starting frontend..."
pm2 delete siara-frontend 2>/dev/null
pm2 start ecosystem.config.js --only siara-frontend
sleep 5

echo ""
echo "10. Final status..."
pm2 status

echo ""
echo "=========================================="
echo "Done!"
echo "=========================================="

