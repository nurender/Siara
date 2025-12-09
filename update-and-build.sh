#!/bin/bash
# Update and build script for Siara Events
# Usage: bash update-and-build.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed!"
