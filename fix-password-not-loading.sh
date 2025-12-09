#!/bin/bash

echo "=========================================="
echo "  Fix Password Not Loading Issue"
echo "=========================================="
echo ""

cd ~/siara-events/backend

echo "1. Checking backend/.env file..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    if [ -f "../.env" ]; then
        echo "   Copying from root .env..."
        cp ../.env .env
    else
        echo "   Creating new .env..."
        cat > .env <<EOF
DB_HOST=127.0.0.1
DB_USER=siara_user
DB_PASSWORD=siara_password_2024
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=siara_events_super_secret_jwt_key_2024_change_this_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://170.64.205.179:3000
NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
EOF
        echo "✅ Created .env file"
    fi
fi

echo ""
echo "2. Checking current .env content..."
echo "   DB_USER: $(grep '^DB_USER=' .env | cut -d= -f2)"
echo "   DB_PASSWORD: $(grep '^DB_PASSWORD=' .env | cut -d= -f2 | sed 's/./*/g')"
echo "   DB_HOST: $(grep '^DB_HOST=' .env | cut -d= -f2)"

echo ""
echo "3. Fixing .env file..."
# Ensure DB_HOST is 127.0.0.1
sed -i 's/^DB_HOST=.*/DB_HOST=127.0.0.1/' .env

# Ensure DB_USER is siara_user
sed -i 's/^DB_USER=.*/DB_USER=siara_user/' .env

# Ensure DB_PASSWORD is set (not empty)
if ! grep -q "^DB_PASSWORD=" .env || grep -q "^DB_PASSWORD=$" .env; then
    if grep -q "^DB_PASSWORD=" .env; then
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=siara_password_2024/' .env
    else
        echo "DB_PASSWORD=siara_password_2024" >> .env
    fi
    echo "✅ Set DB_PASSWORD=siara_password_2024"
fi

# Ensure DB_NAME is set
if ! grep -q "^DB_NAME=" .env; then
    echo "DB_NAME=siara_events" >> .env
    echo "✅ Added DB_NAME"
fi

# Ensure JWT_EXPIRES_IN is set
if ! grep -q "^JWT_EXPIRES_IN=" .env; then
    echo "JWT_EXPIRES_IN=7d" >> .env
    echo "✅ Added JWT_EXPIRES_IN"
fi

echo ""
echo "4. Verifying .env file..."
echo "   Updated configuration:"
grep -E "^DB_|^JWT_" .env | while read line; do
    if [[ $line == *"PASSWORD"* ]]; then
        echo "   ${line%%=*}=****"
    else
        echo "   $line"
    fi
done

echo ""
echo "5. Testing MySQL connection with credentials..."
DB_USER=$(grep '^DB_USER=' .env | cut -d= -f2)
DB_PASSWORD=$(grep '^DB_PASSWORD=' .env | cut -d= -f2)
DB_HOST=$(grep '^DB_HOST=' .env | cut -d= -f2)

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ DB_PASSWORD is empty!"
    exit 1
fi

mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "SELECT 1;" 2>&1
if [ $? -eq 0 ]; then
    echo "✅ MySQL connection OK"
else
    echo "❌ MySQL connection failed!"
    echo "   Checking if siara_user exists..."
    mysql -u root -e "SELECT User, Host FROM mysql.user WHERE User='siara_user';" 2>&1
    if [ $? -ne 0 ]; then
        echo "   ⚠️  siara_user not found. Please run:"
        echo "      sudo bash ~/create-mysql-user.sh"
        echo "   Or manually create user with MySQL root access"
    fi
fi

echo ""
echo "6. Testing Node.js connection..."
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  try {
    const host = process.env.DB_HOST || '127.0.0.1';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'siara_events';
    
    console.log('   Connecting with:');
    console.log('     Host:', host);
    console.log('     User:', user);
    console.log('     Password:', password ? '***' : '(empty)');
    console.log('     Database:', database);
    
    const conn = await mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
    });
    console.log('   ✅ Node.js database connection OK');
    await conn.end();
  } catch (error) {
    console.log('   ❌ Node.js database connection failed:', error.message);
    process.exit(1);
  }
})();
" || {
    echo "❌ Node.js connection test failed!"
    echo ""
    echo "Please check:"
    echo "  1. .env file has DB_PASSWORD set (not empty)"
    echo "  2. MySQL user 'siara_user' exists"
    echo "  3. MySQL user has correct password"
    exit 1
}

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "Next: Restart backend"
echo "  pm2 restart siara-backend"
echo "  pm2 logs siara-backend"
echo ""

