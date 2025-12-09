#!/bin/bash
# Complete deployment script for server

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "🔨 Building Next.js application..."
npm run build

echo "📁 Creating logs directory..."
mkdir -p logs

echo "✅ Dependencies installed and application built!"
echo ""
echo "⚠️  IMPORTANT: Before starting PM2, make sure to:"
echo "   1. Create .env file in root directory"
echo "   2. Create .env file in backend directory"
echo "   3. Setup database (mysql -u root -p)"
echo ""
echo "After setting up .env files, run:"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
