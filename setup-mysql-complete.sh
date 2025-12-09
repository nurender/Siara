#!/bin/bash
# Complete MySQL setup script

echo "🔧 MySQL Complete Setup"
echo "======================="
echo ""

# Check if MySQL client exists
if command -v mysql &> /dev/null; then
    echo "✅ MySQL client found"
    MYSQL_VERSION=$(mysql --version)
    echo "   Version: $MYSQL_VERSION"
    
    # Test connection
    echo ""
    echo "Testing MySQL connection..."
    if mysql -u root -e "SELECT 1;" 2>/dev/null; then
        echo "✅ MySQL is accessible!"
        
        # Create database
        echo ""
        echo "Creating database..."
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>/dev/null && echo "✅ Database created" || echo "⚠️  Database creation failed"
        
        # Setup tables
        echo ""
        echo "Setting up database tables..."
        cd ~/siara-events/backend
        
        if [ -f database/setup.js ]; then
            node database/setup.js 2>&1 | tail -5
        fi
        
        if [ -f database/setup-cms.js ]; then
            node database/setup-cms.js 2>&1 | tail -5
        fi
        
        echo ""
        echo "✅ Database setup complete!"
        
    else
        echo "❌ MySQL connection failed"
        echo ""
        echo "Trying to fix authentication..."
        echo "Please run manually:"
        echo "  sudo mysql"
        echo "  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
        echo "  FLUSH PRIVILEGES;"
        echo "  EXIT;"
    fi
else
    echo "❌ MySQL not installed"
    echo ""
    echo "📦 Installation required:"
    echo "  sudo apt update"
    echo "  sudo apt install mysql-server -y"
    echo "  sudo systemctl start mysql"
    echo "  sudo systemctl enable mysql"
    echo ""
    echo "After installation, run this script again."
fi

echo ""
echo "======================="
echo "Next: Restart backend"
echo "  cd ~/siara-events"
echo "  export NVM_DIR=\"\$HOME/.nvm\""
echo "  [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\""
echo "  pm2 restart siara-backend"

