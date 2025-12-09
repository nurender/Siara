#!/bin/bash
# Fix connection refused error

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🔧 Fixing connection issues..."
echo ""

# Check if MySQL is accessible without password
echo "1️⃣ Testing MySQL connection..."
if mysql -u root -e "SHOW DATABASES;" 2>/dev/null; then
    echo "✅ MySQL accessible without password"
    DB_PASS=""
else
    echo "⚠️  MySQL needs password or not installed"
    echo "   Please set DB_PASSWORD in .env file"
    DB_PASS=""
fi

# Create database
echo ""
echo "2️⃣ Creating database..."
mysql -u root $([ -z "$DB_PASS" ] && echo "" || echo "-p$DB_PASS") -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>/dev/null && echo "✅ Database ready" || echo "⚠️  Cannot create database"

# Check .env
echo ""
echo "3️⃣ Checking .env file..."
if [ -f .env ]; then
    echo "✅ .env file exists"
    grep DB_PASSWORD .env || echo "DB_PASSWORD not set"
else
    echo "❌ .env file missing"
fi

# Copy to backend
echo ""
echo "4️⃣ Copying .env to backend..."
cp .env backend/.env 2>/dev/null && echo "✅ Copied" || echo "⚠️  Copy failed"

# Restart backend
echo ""
echo "5️⃣ Restarting backend..."
pm2 restart siara-backend
sleep 3

# Check status
echo ""
echo "6️⃣ Checking backend status..."
pm2 status siara-backend

echo ""
echo "7️⃣ Testing API..."
curl -s http://localhost:5000/api/health && echo "" || echo "❌ API not responding"

echo ""
echo "📋 Recent logs:"
pm2 logs siara-backend --lines 5 --nostream

