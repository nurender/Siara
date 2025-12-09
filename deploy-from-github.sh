#!/bin/bash

# Deploy Siara Events from GitHub to Server
# Usage: ./deploy-from-github.sh

set -e

SERVER_USER="nurender"
SERVER_HOST="170.64.205.179"
REPO_URL="https://github.com/nurender/Siara.git"
APP_DIR="~/siara-events"

echo "🚀 Deploying Siara Events from GitHub..."
echo "📦 Repository: $REPO_URL"
echo "🖥️  Server: $SERVER_USER@$SERVER_HOST"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# SSH into server and deploy
ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
set -e

APP_DIR=~/siara-events
REPO_URL=https://github.com/nurender/Siara.git

echo "📥 Cloning/Updating repository..."
if [ -d "$APP_DIR" ]; then
    echo "🔄 Updating existing repository..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/main
    git clean -fd
else
    echo "📦 Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

echo "📦 Installing frontend dependencies..."
npm install --production=false

echo "📦 Installing backend dependencies..."
cd backend
npm install --production=false
cd ..

echo "🔨 Building Next.js application..."
npm run build

echo "🗄️  Setting up database (if needed)..."
cd backend
if [ -f database/setup-cms.js ]; then
    node database/setup-cms.js || echo "⚠️  Database setup skipped or already done"
fi
cd ..

echo "📁 Creating logs directory..."
mkdir -p logs

echo "🔄 Restarting PM2 processes..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "siara-backend\|siara-frontend"; then
        echo "🔄 Restarting existing PM2 processes..."
        pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
    else
        echo "▶️  Starting PM2 processes..."
        pm2 start ecosystem.config.js
    fi
    pm2 save
    echo "✅ PM2 processes restarted"
else
    echo "⚠️  PM2 not found. Installing PM2..."
    npm install -g pm2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
fi

echo ""
echo "✅ Deployment completed successfully!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs"

ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://170.64.205.179:3000"
echo "   Backend API: http://170.64.205.179:5000/api/health"
echo ""
echo "📊 To check status, run:"
echo "   ssh $SERVER_USER@$SERVER_HOST 'pm2 status'"

