# 🔧 Fix: Access Denied for User 'root'@'localhost'

## Problem
Backend ko MySQL se connect nahi ho raha: `Access denied for user 'root'@'localhost'`

## Quick Fix

Server par ye commands run karein:

```bash
# Method 1: Fix root user (Recommended)
sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
EXIT;
EOF

# Test
mysql -u root -e "SELECT 1;"
```

## Or Use Script

```bash
# Script download
cd ~
wget -O fix-mysql-root.sh https://raw.githubusercontent.com/nurender/Siara/main/fix-mysql-root.sh
chmod +x fix-mysql-root.sh

# Run
sudo bash fix-mysql-root.sh
```

## Alternative: Set a Password

Agar empty password kaam nahi kare, to password set karein:

```bash
# Set password
sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password_here';
FLUSH PRIVILEGES;
EXIT;
EOF

# Update .env file
cd ~/siara-events/backend
nano .env
# Change: DB_PASSWORD=your_password_here
```

## Verify

```bash
# Test MySQL connection
mysql -u root -e "SELECT 1;"

# Test database
mysql -u root -e "USE siara_events; SHOW TABLES;"

# Test backend
cd ~/siara-events/backend
node server.js
# Should show: ✅ MySQL Database connected successfully!
```

## Restart Backend

```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 restart siara-backend

# Check
pm2 status
pm2 logs siara-backend --lines 20
curl http://localhost:5000/api/health
```

---

**Note:** MySQL 8.0+ mein authentication method different ho sakta hai. `sudo mysql` use karein ya root user ko properly configure karein.

