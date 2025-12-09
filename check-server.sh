#!/bin/bash
# Check server status and fix issues

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🔍 Checking server status..."
echo ""

# Check PM2
echo "📊 PM2 Status:"
pm2 status || echo "PM2 not found or not running"
echo ""

# Check backend
echo "🔌 Backend Health Check:"
curl -s http://localhost:5000/api/health || echo "❌ Backend not responding on port 5000"
echo ""

# Check frontend
echo "🌐 Frontend Check:"
curl -s http://localhost:3000 | head -5 || echo "❌ Frontend not responding on port 3000"
echo ""

# Check ports
echo "🔌 Port Status:"
netstat -tuln | grep -E ':3000|:5000' || echo "Ports not in use"
echo ""

# Check environment
echo "📝 Environment Variables:"
echo "NEXT_PUBLIC_API_URL: $(grep NEXT_PUBLIC_API_URL .env || echo 'NOT SET')"
echo "FRONTEND_URL: $(grep FRONTEND_URL .env || echo 'NOT SET')"
echo ""

# Check backend logs
echo "📋 Backend Logs (last 10 lines):"
pm2 logs siara-backend --lines 10 --nostream 2>/dev/null || echo "Cannot read logs"
echo ""

# Check frontend logs
echo "📋 Frontend Logs (last 10 lines):"
pm2 logs siara-frontend --lines 10 --nostream 2>/dev/null || echo "Cannot read logs"

