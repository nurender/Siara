#!/bin/bash

# Siara Events - Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file with required environment variables."
    exit 1
fi

# Install/Update dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

# Build Next.js application
echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
npm run build

# Setup database (if needed)
echo -e "${YELLOW}🗄️  Setting up database...${NC}"
cd backend
if [ -f database/setup-cms.js ]; then
    node database/setup-cms.js || echo "Database setup skipped or already done"
fi
cd ..

# Restart PM2 processes
echo -e "${YELLOW}🔄 Restarting PM2 processes...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
    pm2 save
else
    echo -e "${RED}⚠️  PM2 not found. Please install PM2: npm install -g pm2${NC}"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

