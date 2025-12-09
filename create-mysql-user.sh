#!/bin/bash
# Create MySQL user for backend application

echo "🔧 Creating MySQL User for Backend"
echo "==================================="
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script needs sudo access"
    echo "Run: sudo bash create-mysql-user.sh"
    exit 1
fi

echo "1️⃣ Creating database user..."
sudo mysql <<EOF
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS siara_events;

-- Create user for backend (if not exists)
CREATE USER IF NOT EXISTS 'siara_user'@'localhost' IDENTIFIED BY 'siara_password_2024';

-- Grant all privileges
GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show users
SELECT user, host FROM mysql.user WHERE user IN ('root', 'siara_user');
EOF

echo ""
echo "2️⃣ Testing new user connection..."
if mysql -u siara_user -psiara_password_2024 -e "USE siara_events; SELECT 1;" 2>/dev/null; then
    echo "✅ New user created and tested successfully!"
else
    echo "❌ User creation failed"
    exit 1
fi

echo ""
echo "3️⃣ Updating .env file..."
cd ~/siara-events/backend 2>/dev/null || cd /home/nurie/siara-events/backend

if [ -f .env ]; then
    # Backup .env
    cp .env .env.backup
    
    # Update .env with new user
    sed -i 's/^DB_USER=.*/DB_USER=siara_user/' .env
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=siara_password_2024/' .env
    
    echo "✅ .env file updated"
    echo ""
    echo "Updated values:"
    echo "  DB_USER=siara_user"
    echo "  DB_PASSWORD=siara_password_2024"
else
    echo "⚠️  .env file not found"
fi

echo ""
echo "========================================"
echo "✅ MySQL User Setup Complete!"
echo ""
echo "Credentials:"
echo "  User: siara_user"
echo "  Password: siara_password_2024"
echo "  Database: siara_events"
echo ""
echo "Next: Setup database tables"
echo "  cd ~/siara-events/backend"
echo "  node database/setup.js"
echo "  node database/setup-cms.js"
echo ""
echo "Then restart backend:"
echo "  cd ~/siara-events"
echo "  export NVM_DIR=\"\$HOME/.nvm\""
echo "  [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\""
echo "  pm2 restart siara-backend"

