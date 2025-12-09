#!/bin/bash

echo "=========================================="
echo "  Complete Deployment to Server"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server details
SERVER="root@170.64.205.179"
PROJECT_DIR="~/siara-events"

echo "Deploying to: $SERVER"
echo ""

# Step 1: Check if we can connect
echo "1. Testing SSH connection..."
ssh -o ConnectTimeout=5 $SERVER "echo 'SSH connection OK'" 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Cannot connect to server!${NC}"
    echo "Please check:"
    echo "  - SSH key is set up"
    echo "  - Server is accessible"
    echo "  - You have root access"
    exit 1
fi
echo -e "${GREEN}✅ SSH connection OK${NC}"

echo ""
echo "=========================================="
echo "Running deployment on server..."
echo "=========================================="
echo ""

# Run deployment commands on server
ssh $SERVER << 'ENDSSH'
set -e

echo "=========================================="
echo "  Server Deployment Script"
echo "=========================================="
echo ""

cd ~

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Step 1: Clone or update repository
echo "1. Setting up repository..."
if [ -d "siara-events" ]; then
    echo "   Repository exists, updating..."
    cd siara-events
    git pull origin main || echo "   ⚠️  Git pull failed, continuing..."
else
    echo "   Cloning repository..."
    git clone https://github.com/nurender/Siara.git siara-events
    cd siara-events
fi

# Step 2: Check Node.js
echo ""
echo "2. Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "   Installing Node.js via NVM..."
    if [ ! -d "$HOME/.nvm" ]; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    fi
    nvm install 18
    nvm use 18
    nvm alias default 18
fi
echo "   Node: $(node -v)"
echo "   NPM: $(npm -v)"

# Step 3: Install PM2
echo ""
echo "3. Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "   Installing PM2..."
    npm install -g pm2
fi
echo "   PM2: $(pm2 --version)"

# Step 4: Setup .env file
echo ""
echo "4. Setting up .env file..."
if [ ! -f ".env" ]; then
    echo "   Creating .env file..."
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
fi

# Copy to backend
cp .env backend/.env
echo "   ✅ .env files configured"

# Step 5: Install dependencies
echo ""
echo "5. Installing dependencies..."
echo "   Frontend dependencies..."
npm install

echo "   Backend dependencies..."
cd backend
npm install
cd ..

# Step 6: Setup MySQL user (if needed)
echo ""
echo "6. Checking MySQL setup..."
mysql -u siara_user -psiara_password_2024 -e "SELECT 1;" 2>/dev/null || {
    echo "   ⚠️  MySQL user not found, creating..."
    if [ -f "create-mysql-user.sh" ]; then
        sudo bash create-mysql-user.sh
    else
        echo "   Please run: sudo bash create-mysql-user.sh"
    fi
}

# Step 7: Setup database
echo ""
echo "7. Setting up database..."
cd backend
if [ -f "database/setup.js" ]; then
    node database/setup.js
    echo "   ✅ Database tables created"
fi
cd ..

# Step 8: Build frontend
echo ""
echo "8. Building frontend..."
echo "   This may take 2-5 minutes..."
npm run build
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend build successful"
else
    echo "   ❌ Frontend build failed!"
    exit 1
fi

# Step 9: Start with PM2
echo ""
echo "9. Starting services with PM2..."
pm2 delete all 2>/dev/null || true
sleep 2

# Start backend
echo "   Starting backend..."
pm2 start ecosystem.config.js --only siara-backend
sleep 5

# Start frontend
echo "   Starting frontend..."
pm2 start ecosystem.config.js --only siara-frontend
sleep 5

# Step 10: Save PM2 configuration
pm2 save

# Step 11: Final status
echo ""
echo "10. Final Status..."
pm2 status

echo ""
echo "11. Testing services..."
echo "   Backend:"
curl -s http://localhost:5000/api/health && echo "" || echo "   ⚠️  Backend not responding"

echo "   Frontend:"
curl -s -I http://localhost:3000 | head -1 || echo "   ⚠️  Frontend not responding"

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Access URLs:"
echo "  Frontend: http://170.64.205.179:3000"
echo "  Backend:  http://170.64.205.179:5000"
echo "  Manager:  http://170.64.205.179:3000/manager/login"
echo ""
echo "Default Admin:"
echo "  Email: admin@siara.com"
echo "  Password: admin123"
echo ""
echo "Useful Commands:"
echo "  pm2 status              - Check process status"
echo "  pm2 logs                - View all logs"
echo "  pm2 restart all         - Restart all processes"
echo ""

ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo ""
    echo "You can now access:"
    echo "  Frontend: http://170.64.205.179:3000"
    echo "  Backend:  http://170.64.205.179:5000"
else
    echo ""
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Please check the error messages above"
    exit 1
fi

