#!/bin/bash
# Install and setup MySQL

echo "🔧 MySQL Installation & Setup"
echo "============================="
echo ""

# Check if MySQL is installed
echo "1️⃣ Checking MySQL installation..."
if command -v mysql &> /dev/null; then
    echo "   ✅ MySQL client installed"
    MYSQL_INSTALLED=true
else
    echo "   ❌ MySQL not installed"
    MYSQL_INSTALLED=false
fi

# Check if MySQL service exists
echo ""
echo "2️⃣ Checking MySQL service..."
if systemctl list-unit-files | grep -q mysql; then
    echo "   ✅ MySQL service found"
    SERVICE_NAME=$(systemctl list-unit-files | grep mysql | head -1 | awk '{print $1}')
    echo "   Service name: $SERVICE_NAME"
elif systemctl list-unit-files | grep -qi mariadb; then
    echo "   ✅ MariaDB found (MySQL alternative)"
    SERVICE_NAME=$(systemctl list-unit-files | grep -i mariadb | head -1 | awk '{print $1}')
    echo "   Service name: $SERVICE_NAME"
else
    echo "   ❌ MySQL/MariaDB service not found"
    echo ""
    echo "   💡 Installation required:"
    echo "      sudo apt update"
    echo "      sudo apt install mysql-server -y"
    echo "      sudo systemctl start mysql"
    echo "      sudo systemctl enable mysql"
    exit 1
fi

# Try to start service (if sudo available)
echo ""
echo "3️⃣ Starting MySQL service..."
if sudo systemctl start $SERVICE_NAME 2>/dev/null; then
    echo "   ✅ MySQL service started"
elif systemctl --user start $SERVICE_NAME 2>/dev/null; then
    echo "   ✅ MySQL service started (user mode)"
else
    echo "   ⚠️  Cannot start service (need sudo or already running)"
fi

# Test connection
echo ""
echo "4️⃣ Testing MySQL connection..."
if mysql -u root -e "SELECT 1;" 2>/dev/null; then
    echo "   ✅ MySQL connection successful!"
    
    # Create database
    echo ""
    echo "5️⃣ Creating database..."
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;" 2>/dev/null && echo "   ✅ Database created" || echo "   ⚠️  Database creation failed"
    
    # Check tables
    echo ""
    echo "6️⃣ Checking database tables..."
    TABLE_COUNT=$(mysql -u root siara_events -e "SHOW TABLES;" 2>/dev/null | wc -l)
    if [ "$TABLE_COUNT" -lt 2 ]; then
        echo "   ⚠️  Tables missing - need to run setup"
    else
        echo "   ✅ Database tables exist"
    fi
else
    echo "   ❌ MySQL connection failed"
    echo ""
    echo "   💡 Try:"
    echo "      mysql -u root"
    echo "      Or check if MySQL is running"
fi

echo ""
echo "============================="
echo "✅ Check Complete!"

