#!/bin/bash
# Rebuild frontend with correct API URL

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🔨 Rebuilding frontend with correct API URL..."
echo ""

# Load .env and rebuild
export $(cat .env | grep -v '^#' | xargs)
npm run build

echo ""
echo "🔄 Restarting frontend..."
pm2 restart siara-frontend

echo ""
echo "✅ Frontend rebuilt and restarted!"
echo ""
echo "📊 PM2 Status:"
pm2 status

