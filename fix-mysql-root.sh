#!/bin/bash
# Fix MySQL root user authentication

echo "🔧 Fixing MySQL Root User Authentication"
echo "========================================"
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script needs sudo access"
    echo "Run: sudo bash fix-mysql-root.sh"
    exit 1
fi

echo "1️⃣ Checking MySQL status..."
if systemctl is-active --quiet mysql; then
    echo "✅ MySQL is running"
else
    echo "❌ MySQL is not running. Starting..."
    systemctl start mysql
    sleep 2
fi

echo ""
echo "2️⃣ Configuring MySQL root user..."
# Method 1: Try with sudo mysql (works without password)
sudo mysql <<EOF
-- Drop existing root user if exists
DROP USER IF EXISTS 'root'@'localhost';

-- Create root user with empty password
CREATE USER 'root'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Verify
SELECT user, host, plugin FROM mysql.user WHERE user='root';
EOF

echo ""
echo "3️⃣ Testing connection..."
if mysql -u root -e "SELECT 1;" 2>/dev/null; then
    echo "✅ MySQL root user configured successfully!"
else
    echo "⚠️  Direct connection failed, trying alternative method..."
    
    # Alternative: Use auth_socket for root
    sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
FLUSH PRIVILEGES;
EOF
    
    echo "✅ Using auth_socket authentication"
fi

echo ""
echo "4️⃣ Creating database..."
mysql -u root <<EOF 2>/dev/null || sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS siara_events;
SHOW DATABASES LIKE 'siara_events';
EOF

echo ""
echo "5️⃣ Testing database connection..."
if mysql -u root -e "USE siara_events; SELECT 1;" 2>/dev/null || sudo mysql -e "USE siara_events; SELECT 1;" 2>/dev/null; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed"
    echo ""
    echo "Manual fix:"
    echo "  sudo mysql"
    echo "  ALTER USER 'root'@'localhost' IDENTIFIED BY '';"
    echo "  FLUSH PRIVILEGES;"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ MySQL Root User Fixed!"
echo ""
echo "Next: Restart backend"
echo "  cd ~/siara-events/backend"
echo "  node server.js"
echo ""
echo "Or with PM2:"
echo "  cd ~/siara-events"
echo "  export NVM_DIR=\"\$HOME/.nvm\""
echo "  [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\""
echo "  pm2 restart siara-backend"

