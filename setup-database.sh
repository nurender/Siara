#!/bin/bash
# Setup database and fix connection

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🗄️  Setting up database..."
echo ""

# Try to connect without password first
echo "Testing MySQL connection..."
mysql -u root -e "SHOW DATABASES;" 2>/dev/null && echo "✅ MySQL accessible without password" || echo "⚠️  MySQL needs password"

# Create database if it doesn't exist
echo ""
echo "Creating database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>/dev/null && echo "✅ Database created" || echo "⚠️  Cannot create database - check MySQL password"

# Run setup scripts
echo ""
echo "Running database setup..."
cd backend

# Try setup without password
node database/setup.js 2>&1 | tail -5 || echo "Setup failed - check .env DB_PASSWORD"

cd ..

echo ""
echo "🔄 Restarting backend..."
pm2 restart siara-backend
sleep 2

echo ""
echo "📊 Checking backend health..."
curl -s http://localhost:5000/api/health && echo "" || echo "❌ Backend still not responding"

