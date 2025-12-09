#!/bin/bash
# MySQL Installation Script - Run with sudo access

set -e  # Exit on error

echo "🔧 MySQL Installation & Setup"
echo "============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  This script needs sudo access${NC}"
    echo "Please run: sudo bash install-mysql-now.sh"
    exit 1
fi

# Step 1: Update packages
echo "1️⃣ Updating packages..."
apt update -y

# Step 2: Install MySQL
echo ""
echo "2️⃣ Installing MySQL server..."
apt install mysql-server -y

# Step 3: Start MySQL
echo ""
echo "3️⃣ Starting MySQL service..."
systemctl start mysql
systemctl enable mysql

# Step 4: Check status
echo ""
echo "4️⃣ Checking MySQL status..."
if systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✅ MySQL is running${NC}"
else
    echo -e "${RED}❌ MySQL failed to start${NC}"
    systemctl status mysql
    exit 1
fi

# Step 5: Configure MySQL root user (allow empty password)
echo ""
echo "5️⃣ Configuring MySQL root user..."
mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EOF

# Step 6: Create database
echo ""
echo "6️⃣ Creating database..."
mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS siara_events;
SHOW DATABASES;
EOF

# Step 7: Setup database tables
echo ""
echo "7️⃣ Setting up database tables..."
cd ~/siara-events/backend 2>/dev/null || cd /home/nurie/siara-events/backend

if [ -f database/setup.js ]; then
    echo "Running setup.js..."
    node database/setup.js
fi

if [ -f database/setup-cms.js ]; then
    echo "Running setup-cms.js..."
    node database/setup-cms.js
fi

# Step 8: Restart backend
echo ""
echo "8️⃣ Restarting backend..."
cd ~/siara-events 2>/dev/null || cd /home/nurie/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 delete siara-backend 2>/dev/null || true
pm2 start ecosystem.config.js --only siara-backend

# Step 9: Wait and check
echo ""
echo "9️⃣ Waiting for backend to start..."
sleep 5

# Step 10: Verify
echo ""
echo "🔟 Verifying installation..."
echo ""
echo "MySQL Status:"
systemctl status mysql --no-pager | head -5

echo ""
echo "PM2 Status:"
pm2 status

echo ""
echo "Backend Health:"
curl -s http://localhost:5000/api/health || echo "Backend not responding yet"

echo ""
echo "============================="
echo -e "${GREEN}✅ MySQL Installation Complete!${NC}"
echo ""
echo "Next steps:"
echo "  - Check backend logs: pm2 logs siara-backend"
echo "  - Test API: curl http://localhost:5000/api/health"
echo "  - Test database: mysql -u root -e 'USE siara_events; SHOW TABLES;'"

