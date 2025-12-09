#!/bin/bash

# Server-side Deployment Script for Siara Events
# This script should be run on the server: nurie@170.64.205.179
# Usage: ./server-deploy.sh

set -e

echo "🚀 Siara Events - Server Deployment"
echo "===================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_DIR="$HOME/siara-events"
GIT_REPO="https://github.com/nurender/Siara.git"

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}📦 Cloning repository...${NC}"
    cd ~
    git clone $GIT_REPO siara-events
    cd siara-events
else
    echo -e "${YELLOW}🔄 Updating code from GitHub...${NC}"
    cd $PROJECT_DIR
    git pull origin main
fi

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file with required environment variables."
    echo "Example:"
    echo "  DB_HOST=localhost"
    echo "  DB_USER=root"
    echo "  DB_PASSWORD=your_password"
    echo "  DB_NAME=siara_events"
    echo "  PORT=5000"
    echo "  NODE_ENV=production"
    echo "  JWT_SECRET=your_secret_key"
    echo "  FRONTEND_URL=http://170.64.205.179:3000"
    echo "  NEXT_PUBLIC_API_URL=http://170.64.205.179:5000"
    exit 1
fi

# Check for backend .env
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}⚠️  Backend .env not found, copying from root...${NC}"
    cp .env backend/.env || echo "Please create backend/.env manually"
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

# Build Next.js
echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
npm run build

# Create logs directory
mkdir -p logs

# Restart PM2
echo -e "${YELLOW}🔄 Managing PM2 processes...${NC}"
if command -v pm2 &> /dev/null; then
    # Stop existing processes if running
    pm2 delete siara-backend 2>/dev/null || true
    pm2 delete siara-frontend 2>/dev/null || true
    
    # Start new processes
    pm2 start ecosystem.config.js
    pm2 save
    
    echo -e "${GREEN}✅ PM2 processes started!${NC}"
    echo -e "${YELLOW}📊 Status:${NC}"
    pm2 status
else
    echo -e "${RED}⚠️  PM2 not found. Installing...${NC}"
    sudo npm install -g pm2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
fi

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📊 Useful commands:"
echo "  pm2 status          - Check process status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart all processes"
echo ""
echo "🌐 Access your application:"
echo "  Frontend: http://170.64.205.179:3000"
echo "  Backend API: http://170.64.205.179:5000/api/health"

