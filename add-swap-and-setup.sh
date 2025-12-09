#!/bin/bash

echo "=========================================="
echo "  Add Swap & Complete Setup"
echo "=========================================="
echo ""

# Check if swap exists
echo "1. Checking current swap..."
SWAP_SIZE=$(free -h | grep Swap | awk '{print $2}')
if [ "$SWAP_SIZE" != "0B" ] && [ "$SWAP_SIZE" != "" ]; then
    echo "✅ Swap already exists: $SWAP_SIZE"
else
    echo "⚠️  No swap found! Creating 2GB swap..."
    
    # Check if swapfile already exists
    if [ -f /swapfile ]; then
        echo "   Swapfile exists but not active"
        sudo swapon /swapfile 2>/dev/null && echo "   ✅ Activated existing swapfile" || echo "   ⚠️  Could not activate (may need to recreate)"
    else
        echo "   Creating 2GB swapfile (needs sudo password)..."
        sudo fallocate -l 2G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        
        # Make permanent
        if ! grep -q "/swapfile" /etc/fstab; then
            echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        fi
        
        echo "   ✅ Swap created and activated"
    fi
fi

# Verify swap
echo ""
echo "2. Verifying swap..."
free -h | grep -A1 "Swap:"

echo ""
echo "3. Setting up Node.js and PM2..."
cd ~

# Setup NVM
if [ ! -d "$HOME/.nvm" ]; then
    echo "   Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    echo "❌ NVM installation failed!"
    exit 1
fi

echo "✅ NVM loaded"

# Install Node.js
echo ""
echo "4. Installing Node.js 18..."
nvm install 18 --latest-npm
nvm use 18
nvm alias default 18

# Test Node
NODE_VERSION=$(node -v 2>&1)
NPM_VERSION=$(npm -v 2>&1)

if [[ "$NODE_VERSION" == *"Killed"* ]] || [[ "$NPM_VERSION" == *"Killed"* ]]; then
    echo "❌ Node still getting killed even with swap!"
    echo "   This might be a different issue. Check:"
    echo "   - dmesg | grep -i killed"
    echo "   - ulimit -a"
    exit 1
fi

echo "✅ Node.js: $NODE_VERSION"
echo "✅ NPM: $NPM_VERSION"

# Install PM2
echo ""
echo "5. Installing PM2..."
npm install -g pm2
PM2_VERSION=$(pm2 --version 2>&1)
echo "✅ PM2: $PM2_VERSION"

# Setup environment
echo ""
echo "6. Setting up environment..."
if ! grep -q "NVM_DIR" ~/.bashrc 2>/dev/null; then
    echo '' >> ~/.bashrc
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"' >> ~/.bashrc
    echo "✅ Added to .bashrc"
fi

# Check MySQL
echo ""
echo "7. Checking MySQL..."
cd ~/siara-events 2>/dev/null || { echo "❌ siara-events directory not found!"; exit 1; }

mysql -u siara_user -psiara_password_2024 -e "SELECT 1;" 2>&1 | grep -q "1"
if [ $? -ne 0 ]; then
    echo "⚠️  MySQL user 'siara_user' not found"
    echo "   Please run: sudo bash create-mysql-user.sh"
else
    echo "✅ MySQL connection OK"
fi

# Setup backend .env
echo ""
echo "8. Setting up backend/.env..."
cd backend
if [ -f ".env" ]; then
    if ! grep -q "DB_USER=siara_user" .env; then
        sed -i 's/^DB_USER=.*/DB_USER=siara_user/' .env
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=siara_password_2024/' .env
    fi
    if ! grep -q "JWT_EXPIRES_IN" .env; then
        echo "JWT_EXPIRES_IN=7d" >> .env
    fi
    echo "✅ .env configured"
else
    echo "⚠️  .env not found"
fi
cd ..

# Setup database
echo ""
echo "9. Setting up database tables..."
cd backend
if [ -f "database/setup.js" ]; then
    node database/setup.js 2>&1 | tail -3
fi
cd ..

# Start PM2
echo ""
echo "10. Starting services with PM2..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 delete all 2>/dev/null

echo "   Starting backend..."
pm2 start ecosystem.config.js --only siara-backend
sleep 5

echo "   Starting frontend..."
pm2 start ecosystem.config.js --only siara-frontend
sleep 5

# Final status
echo ""
echo "11. Final Status..."
pm2 status

echo ""
echo "12. Testing APIs..."
echo "   Backend:"
curl -s http://localhost:5000/api/health && echo "" || echo "   ❌ Backend not responding"
echo "   Frontend:"
curl -s -I http://localhost:3000 | head -1 || echo "   ❌ Frontend not responding"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "System Resources:"
free -h | grep -E "Mem:|Swap:"
echo ""
echo "Access URLs:"
echo "  Frontend: http://170.64.205.179:3000"
echo "  Backend:  http://170.64.205.179:5000"
echo ""

