# 🔧 Fix MySQL Password Error

## Problem
`ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded`

MySQL 8.0+ uses `caching_sha2_password` by default, not `mysql_native_password`.

## Quick Fix

Server par ye commands run karein:

```bash
# Option 1: Use sudo mysql (works without password)
sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS siara_events;
EXIT;
EOF

# Option 2: Or just use default authentication
sudo mysql -e "CREATE DATABASE IF NOT EXISTS siara_events;"
```

## Continue Setup

```bash
# Database setup
cd ~/siara-events/backend
node database/setup.js
node database/setup-cms.js

# Backend restart
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart siara-backend

# Check
pm2 status
curl http://localhost:5000/api/health
```

## Test Connection

```bash
# Test MySQL
sudo mysql -e "SELECT 1;"

# Test database
sudo mysql -e "USE siara_events; SHOW TABLES;"
```

---

**Note:** MySQL 8.0+ mein `sudo mysql` command password ke bina kaam karta hai. Use karein!

