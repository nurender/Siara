#!/bin/bash

echo "=========================================="
echo "  Fix PM2 & MySQL Issues"
echo "=========================================="
echo ""

cd ~/siara-events

# Step 1: Check NVM
echo "1. Checking NVM..."
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    echo "✅ NVM loaded"
    echo "   Node version: $(node -v)"
    echo "   NPM version: $(npm -v)"
else
    echo "❌ NVM not found!"
    exit 1
fi

# Step 2: Check PM2
echo ""
echo "2. Checking PM2..."
if command -v pm2 &> /dev/null; then
    echo "✅ PM2 found"
    pm2 --version
else
    echo "❌ PM2 not found! Installing..."
    npm install -g pm2
fi

# Step 3: Fix MySQL - Use dedicated user
echo ""
echo "3. Fixing MySQL Connection..."
echo "   Checking if siara_user exists..."

# Check if siara_user exists
mysql -u root -e "SELECT User FROM mysql.user WHERE User='siara_user';" 2>/dev/null | grep -q siara_user

if [ $? -ne 0 ]; then
    echo "   Creating siara_user..."
    sudo mysql <<EOF
CREATE USER IF NOT EXISTS 'siara_user'@'localhost' IDENTIFIED BY 'siara_password_2024';
GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF
    echo "   ✅ siara_user created"
else
    echo "   ✅ siara_user already exists"
fi

# Test connection with siara_user
echo ""
echo "4. Testing MySQL with siara_user..."
mysql -u siara_user -psiara_password_2024 -e "SELECT 1;" 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ MySQL connection OK with siara_user"
    
    # Update .env
    echo ""
    echo "5. Updating backend/.env..."
    cd backend
    if [ -f ".env" ]; then
        # Backup
        cp .env .env.backup
        
        # Update DB credentials
        sed -i 's/^DB_USER=.*/DB_USER=siara_user/' .env
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=siara_password_2024/' .env
        
        echo "   ✅ .env updated"
        echo "   DB_USER=siara_user"
        echo "   DB_PASSWORD=siara_password_2024"
    else
        echo "   ❌ .env not found!"
    fi
    cd ..
else
    echo "   ❌ MySQL connection failed with siara_user"
    echo "   Trying to create database..."
    sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS siara_events;
CREATE USER IF NOT EXISTS 'siara_user'@'localhost' IDENTIFIED BY 'siara_password_2024';
GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF
fi

# Step 6: Ensure database exists
echo ""
echo "6. Ensuring database exists..."
mysql -u siara_user -psiara_password_2024 -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>&1
mysql -u siara_user -psiara_password_2024 -e "USE siara_events; SHOW TABLES;" 2>&1 | head -3

# Step 7: Setup database tables if needed
echo ""
echo "7. Setting up database tables..."
cd backend
if [ ! -f "database/setup.js" ]; then
    echo "   ⚠️  setup.js not found"
else
    node database/setup.js 2>&1 | tail -5
fi
cd ..

# Step 8: Restart PM2 processes
echo ""
echo "8. Restarting PM2 processes..."
pm2 delete all 2>/dev/null
sleep 2

# Start backend
echo "   Starting backend..."
cd ~/siara-events
pm2 start ecosystem.config.js --only siara-backend
sleep 3

# Start frontend
echo "   Starting frontend..."
pm2 start ecosystem.config.js --only siara-frontend
sleep 3

# Step 9: Check status
echo ""
echo "9. Final Status Check..."
pm2 status

echo ""
echo "10. Testing APIs..."
echo "   Backend:"
curl -s http://localhost:5000/api/health || echo "   ❌ Backend not responding"
echo ""
echo "   Frontend:"
curl -s -I http://localhost:3000 | head -1 || echo "   ❌ Frontend not responding"

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "If backend still not working, check logs:"
echo "  pm2 logs siara-backend --lines 50"
echo ""

