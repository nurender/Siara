#!/bin/bash
# Fix backend database connection issue

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🔧 Fixing backend issues..."
echo ""

# Check if MySQL is running
echo "📊 Checking MySQL..."
sudo systemctl status mysql --no-pager | head -3 || echo "MySQL might not be installed"
echo ""

# Check database exists
echo "🗄️  Checking database..."
mysql -u root -e "SHOW DATABASES LIKE 'siara_events';" 2>/dev/null || echo "⚠️  Cannot connect to MySQL. Please check password in .env"
echo ""

# Check .env file
echo "📝 Current .env settings:"
grep -E "DB_|PORT" .env | grep -v PASSWORD
echo ""

# Restart backend
echo "🔄 Restarting backend..."
pm2 restart siara-backend
sleep 3

# Check status
echo ""
echo "📊 Backend Status:"
pm2 status siara-backend

echo ""
echo "📋 Recent Backend Logs:"
pm2 logs siara-backend --lines 5 --nostream

