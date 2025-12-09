#!/bin/bash
# Fix login error by setting up database tables

echo "🔧 Fixing Login Error - Database Setup"
echo "========================================"
echo ""

# Check database connection
echo "1️⃣ Testing database connection..."
if mysql -u siara_user -psiara_password_2024 -e "SELECT 1;" 2>/dev/null; then
    echo "✅ Connected with siara_user"
    DB_USER="siara_user"
    DB_PASS="siara_password_2024"
elif mysql -u root -e "SELECT 1;" 2>/dev/null; then
    echo "✅ Connected with root"
    DB_USER="root"
    DB_PASS=""
elif sudo mysql -e "SELECT 1;" 2>/dev/null; then
    echo "✅ Connected with sudo mysql"
    DB_USER="root"
    DB_PASS=""
    USE_SUDO=true
else
    echo "❌ Cannot connect to MySQL"
    echo "Please run: sudo bash create-mysql-user.sh"
    exit 1
fi

# Check if database exists
echo ""
echo "2️⃣ Checking database..."
if [ "$USE_SUDO" = true ]; then
    DB_EXISTS=$(sudo mysql -e "SHOW DATABASES LIKE 'siara_events';" 2>/dev/null | grep -c siara_events)
else
    DB_EXISTS=$(mysql -u $DB_USER ${DB_PASS:+-p$DB_PASS} -e "SHOW DATABASES LIKE 'siara_events';" 2>/dev/null | grep -c siara_events)
fi

if [ "$DB_EXISTS" -eq 0 ]; then
    echo "⚠️  Database not found, creating..."
    if [ "$USE_SUDO" = true ]; then
        sudo mysql -e "CREATE DATABASE siara_events;"
    else
        mysql -u $DB_USER ${DB_PASS:+-p$DB_PASS} -e "CREATE DATABASE siara_events;"
    fi
fi

# Check if users table exists
echo ""
echo "3️⃣ Checking users table..."
if [ "$USE_SUDO" = true ]; then
    TABLE_EXISTS=$(sudo mysql -e "USE siara_events; SHOW TABLES LIKE 'users';" 2>/dev/null | grep -c users)
else
    TABLE_EXISTS=$(mysql -u $DB_USER ${DB_PASS:+-p$DB_PASS} -e "USE siara_events; SHOW TABLES LIKE 'users';" 2>/dev/null | grep -c users)
fi

if [ "$TABLE_EXISTS" -eq 0 ]; then
    echo "⚠️  Tables not found, setting up database..."
    cd ~/siara-events/backend
    
    if [ -f database/setup.js ]; then
        echo "Running setup.js..."
        node database/setup.js
    else
        echo "❌ setup.js not found"
        exit 1
    fi
    
    if [ -f database/setup-cms.js ]; then
        echo "Running setup-cms.js..."
        node database/setup-cms.js
    fi
    
    if [ -f database/seed.js ]; then
        echo "Running seed.js..."
        node database/seed.js
    fi
else
    echo "✅ Tables exist"
fi

# Check for admin user
echo ""
echo "4️⃣ Checking admin user..."
cd ~/siara-events/backend

if [ "$USE_SUDO" = true ]; then
    ADMIN_EXISTS=$(sudo mysql -e "USE siara_events; SELECT COUNT(*) FROM users WHERE email='admin@siara.com';" 2>/dev/null | tail -1)
else
    ADMIN_EXISTS=$(mysql -u $DB_USER ${DB_PASS:+-p$DB_PASS} -e "USE siara_events; SELECT COUNT(*) FROM users WHERE email='admin@siara.com';" 2>/dev/null | tail -1)
fi

if [ "$ADMIN_EXISTS" -eq 0 ]; then
    echo "⚠️  Admin user not found, creating..."
    if [ -f database/seed.js ]; then
        node database/seed.js
    else
        echo "⚠️  seed.js not found, creating admin manually..."
        # Create admin user with password: admin123
        HASHED_PASS=$(node -e "const bcrypt=require('bcryptjs');bcrypt.hash('admin123',10).then(h=>console.log(h));")
        if [ "$USE_SUDO" = true ]; then
            sudo mysql siara_events <<EOF
INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@siara.com', '$HASHED_PASS', 'admin');
EOF
        else
            mysql -u $DB_USER ${DB_PASS:+-p$DB_PASS} siara_events <<EOF
INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@siara.com', '$HASHED_PASS', 'admin');
EOF
        fi
    fi
else
    echo "✅ Admin user exists"
fi

# Restart backend
echo ""
echo "5️⃣ Restarting backend..."
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 restart siara-backend 2>/dev/null || pm2 start ecosystem.config.js --only siara-backend

# Wait and check
echo ""
echo "6️⃣ Waiting for backend to start..."
sleep 5

# Test
echo ""
echo "7️⃣ Testing backend..."
HEALTH=$(curl -s http://localhost:5000/api/health 2>/dev/null)
if echo "$HEALTH" | grep -q "ok"; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend health check failed"
    echo "Check logs: pm2 logs siara-backend"
fi

echo ""
echo "========================================"
echo "✅ Setup Complete!"
echo ""
echo "Try login with:"
echo "  Email: admin@siara.com"
echo "  Password: admin123"
echo ""
echo "Check logs: pm2 logs siara-backend"

