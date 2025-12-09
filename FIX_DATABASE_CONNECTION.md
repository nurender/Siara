# 🔧 Fix Database Connection Error

## Problem
Backend server database se connect nahi kar pa raha - "Database connection failed" error.

## Quick Fix

### Step 1: Test MySQL Connection
```bash
cd ~/siara-events/backend
chmod +x ~/test-mysql-connection.sh
bash ~/test-mysql-connection.sh
```

### Step 2: Fix Based on Error

#### Error: ER_ACCESS_DENIED_ERROR (Authentication failed)
```bash
# MySQL password fix
sudo mysql
# MySQL prompt me:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;
```

#### Error: ECONNREFUSED (MySQL not running)
```bash
# Start MySQL
sudo systemctl start mysql
sudo systemctl status mysql
```

#### Error: ER_BAD_DB_ERROR (Database doesn't exist)
```bash
# Create database
mysql -u root -e "CREATE DATABASE siara_events;"

# Setup tables
cd ~/siara-events/backend
node database/setup.js
node database/setup-cms.js
```

### Step 3: Verify .env File
```bash
cd ~/siara-events/backend
cat .env
```

**Should have:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Empty if no password
DB_NAME=siara_events
```

### Step 4: Test Node.js Connection
```bash
cd ~/siara-events/backend
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME
    });
    console.log('✅ Connection successful!');
    await conn.end();
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
})();
"
```

### Step 5: Restart Backend
```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 delete siara-backend
pm2 start ecosystem.config.js --only siara-backend

# Check
sleep 3
pm2 status siara-backend
curl http://localhost:5000/api/health
```

---

## Complete Fix Script

```bash
cd ~/siara-events/backend

# 1. Fix MySQL auth (if needed)
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"

# 2. Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"

# 3. Setup tables
node database/setup.js
node database/setup-cms.js

# 4. Verify .env
cat .env | grep DB_

# 5. Test connection
node -e "require('dotenv').config(); const mysql = require('mysql2/promise'); mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME}).then(() => console.log('✅ OK')).catch(e => console.log('❌', e.message));"

# 6. Restart backend
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart siara-backend
```

---

## Common Solutions

### Solution 1: MySQL Authentication
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;
```

### Solution 2: Start MySQL Service
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Solution 3: Create Database
```bash
mysql -u root -e "CREATE DATABASE siara_events;"
cd ~/siara-events/backend
node database/setup.js
```

### Solution 4: Check .env File
```bash
cd ~/siara-events/backend
cat .env
# Ensure DB_PASSWORD is empty if no password
# DB_PASSWORD=
```

---

## Verify Fix

```bash
# Test MySQL
mysql -u root -e "SELECT 1;"

# Test database
mysql -u root -e "USE siara_events; SHOW TABLES;"

# Test Node.js
cd ~/siara-events/backend
node server.js
# Should show: ✅ MySQL Database connected successfully!

# Test API
curl http://localhost:5000/api/health
```

---

**Quick Test:**
```bash
bash ~/test-mysql-connection.sh
```

