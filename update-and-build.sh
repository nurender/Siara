#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events
echo "📥 Pulling latest code..."
git pull origin main

echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed!"

