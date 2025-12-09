#!/bin/bash

echo "=========================================="
echo "  Complete Server Setup"
echo "=========================================="
echo ""

cd ~

# Step 1: Check and setup NVM
echo "1. Setting up NVM..."
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

# Step 2: Install Node.js
echo ""
echo "2. Installing Node.js..."
nvm install 18 --latest-npm
nvm use 18
nvm alias default 18

# Verify
NODE_VERSION=$(node -v 2>&1)
NPM_VERSION=$(npm -v 2>&1)

if [[ "$NODE_VERSION" == *"Killed"* ]] || [[ "$NPM_VERSION" == *"Killed"* ]]; then
    echo "❌ Node/NPM execution failed (likely memory issue)"
    echo ""
    echo "Checking system resources..."
    free -h
    echo ""
    echo "Please check memory and disk space, then try again."
    exit 1
fi

echo "✅ Node.js installed: $NODE_VERSION"
echo "✅ NPM installed: $NPM_VERSION"

# Step 3: Install PM2
echo ""
echo "3. Installing PM2..."
npm install -g pm2

PM2_VERSION=$(pm2 --version 2>&1)
if [[ "$PM2_VERSION" == *"Killed"* ]] || [[ "$PM2_VERSION" == *"not found"* ]]; then
    echo "❌ PM2 installation failed!"
    exit 1
fi

echo "✅ PM2 installed: $PM2_VERSION"

# Step 4: Setup environment in .bashrc and .profile
echo ""
echo "4. Setting up environment..."
if ! grep -q "NVM_DIR" ~/.bashrc 2>/dev/null; then
    echo "" >> ~/.bashrc
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"' >> ~/.bashrc
    echo "✅ Added to .bashrc"
fi

if ! grep -q "NVM_DIR" ~/.profile 2>/dev/null; then
    echo "" >> ~/.profile
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.profile
    echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.profile
    echo "✅ Added to .profile"
fi

# Step 5: Check MySQL user
echo ""
echo "5. Checking MySQL setup..."
cd ~/siara-events 2>/dev/null || { echo "❌ siara-events directory not found!"; exit 1; }

mysql -u siara_user -psiara_password_2024 -e "SELECT 1;" 2>&1 | grep -q "1"
if [ $? -ne 0 ]; then
    echo "⚠️  MySQL user 'siara_user' not found or connection failed"
    echo "   Please run: sudo bash create-mysql-user.sh"
    echo "   Or check FIX_ROOT_ACCESS_DENIED.md"
else
    echo "✅ MySQL connection OK"
fi

# Step 6: Check backend .env
echo ""
echo "6. Checking backend/.env..."
cd backend
if [ -f ".env" ]; then
    if grep -q "DB_USER=siara_user" .env; then
        echo "✅ .env configured with siara_user"
    else
        echo "⚠️  Updating .env..."
        sed -i 's/^DB_USER=.*/DB_USER=siara_user/' .env
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=siara_password_2024/' .env
        echo "✅ .env updated"
    fi
    
    # Check for JWT_EXPIRES_IN
    if ! grep -q "JWT_EXPIRES_IN" .env; then
        echo "JWT_EXPIRES_IN=7d" >> .env
        echo "✅ Added JWT_EXPIRES_IN"
    fi
else
    echo "⚠️  .env not found! Creating from template..."
    if [ -f "../.env" ]; then
        cp ../.env .env
        sed -i 's/^DB_USER=.*/DB_USER=siara_user/' .env
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=siara_password_2024/' .env
        echo "JWT_EXPIRES_IN=7d" >> .env
        echo "✅ Created .env"
    else
        echo "❌ No .env template found!"
    fi
fi
cd ..

# Step 7: Setup database tables
echo ""
echo "7. Setting up database tables..."
cd backend
if [ -f "database/setup.js" ]; then
    node database/setup.js 2>&1 | tail -3
    echo "✅ Database setup complete"
else
    echo "⚠️  setup.js not found"
fi
cd ..

# Step 8: Start PM2 processes
echo ""
echo "8. Starting PM2 processes..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Delete old processes
pm2 delete all 2>/dev/null

# Start backend
echo "   Starting backend..."
pm2 start ecosystem.config.js --only siara-backend
sleep 5

# Check backend
BACKEND_STATUS=$(pm2 status siara-backend --no-color 2>&1 | grep "siara-backend" | awk '{print $10}')
if [ "$BACKEND_STATUS" = "online" ]; then
    echo "✅ Backend started successfully"
else
    echo "⚠️  Backend status: $BACKEND_STATUS"
    echo "   Check logs: pm2 logs siara-backend"
fi

# Start frontend
echo "   Starting frontend..."
pm2 start ecosystem.config.js --only siara-frontend
sleep 5

# Check frontend
FRONTEND_STATUS=$(pm2 status siara-frontend --no-color 2>&1 | grep "siara-frontend" | awk '{print $10}')
if [ "$FRONTEND_STATUS" = "online" ]; then
    echo "✅ Frontend started successfully"
else
    echo "⚠️  Frontend status: $FRONTEND_STATUS"
    echo "   Check logs: pm2 logs siara-frontend"
fi

# Step 9: Final status
echo ""
echo "9. Final Status..."
pm2 status

echo ""
echo "10. Testing APIs..."
echo "   Backend:"
curl -s http://localhost:5000/api/health && echo "" || echo "   ❌ Backend not responding"
echo "   Frontend:"
curl -s -I http://localhost:3000 | head -1 || echo "   ❌ Frontend not responding"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Access URLs:"
echo "  Frontend: http://170.64.205.179:3000"
echo "  Backend:  http://170.64.205.179:5000"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check process status"
echo "  pm2 logs           - View all logs"
echo "  pm2 logs siara-backend   - Backend logs"
echo "  pm2 logs siara-frontend  - Frontend logs"
echo "  pm2 restart all    - Restart all processes"
echo ""

