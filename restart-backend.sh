#!/bin/bash
# Restart backend with proper environment

cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "🔄 Restarting backend..."
pm2 restart siara-backend

echo ""
echo "⏳ Waiting 3 seconds..."
sleep 3

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🔍 Backend Health:"
curl -s http://localhost:5000/api/health || echo "Backend not responding"

echo ""
echo "📋 Recent Logs:"
pm2 logs siara-backend --lines 10 --nostream

