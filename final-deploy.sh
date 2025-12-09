#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🗄️  Setting up database..."
cd backend

# Try to setup database (will fail if MySQL not installed, but that's ok)
node database/setup.js 2>&1 | tail -3 || echo "Database setup skipped or already done"
node database/setup-cms.js 2>&1 | tail -3 || echo "CMS setup skipped or already done"

cd ..

echo "📁 Creating logs directory..."
mkdir -p logs

echo "🚀 Starting PM2 processes..."
# Ensure PM2 is in PATH
export PATH="$HOME/.nvm/versions/node/$(nvm current)/bin:$PATH"
which pm2 || npm list -g pm2 || npm install -g pm2

pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://170.64.205.179:3000"
echo "   Backend: http://170.64.205.179:5000/api/health"
echo ""
echo "📝 View logs: pm2 logs"

