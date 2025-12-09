#!/bin/bash
# Test database connection

cd ~/siara-events/backend

echo "🔍 Testing Database Connection..."
echo ""

# Load .env
export $(cat .env | grep -v '^#' | xargs)

echo "Database Config:"
echo "  DB_HOST: ${DB_HOST:-not set}"
echo "  DB_USER: ${DB_USER:-not set}"
echo "  DB_PASSWORD: ${DB_PASSWORD:-empty}"
echo "  DB_NAME: ${DB_NAME:-not set}"
echo ""

# Test MySQL connection
echo "Testing MySQL connection..."
if mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} -h "$DB_HOST" -e "SELECT 1;" 2>/dev/null; then
    echo "✅ MySQL connection successful!"
    
    # Check database exists
    echo ""
    echo "Checking database..."
    if mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} -h "$DB_HOST" -e "USE $DB_NAME; SELECT 1;" 2>/dev/null; then
        echo "✅ Database '$DB_NAME' exists and accessible"
        
        # Check tables
        TABLE_COUNT=$(mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} -h "$DB_HOST" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null | wc -l)
        echo "✅ Found $TABLE_COUNT tables in database"
    else
        echo "❌ Database '$DB_NAME' does not exist or not accessible"
        echo "Creating database..."
        mysql -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} -h "$DB_HOST" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null && echo "✅ Database created" || echo "❌ Failed to create database"
    fi
else
    echo "❌ MySQL connection failed!"
    echo ""
    echo "Trying without password..."
    if mysql -u root -e "SELECT 1;" 2>/dev/null; then
        echo "✅ MySQL accessible without password"
        echo "Updating .env..."
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env
        echo "✅ .env updated"
    else
        echo "❌ MySQL not accessible"
        echo "Please check:"
        echo "  1. MySQL is running: sudo systemctl status mysql"
        echo "  2. MySQL password in .env file"
    fi
fi

