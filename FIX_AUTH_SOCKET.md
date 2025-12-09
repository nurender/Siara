# 🔧 Fix: MySQL auth_socket Error (1698)

## Problem
`ERROR 1698 (28000): Access denied for user 'root'@'localhost'`

MySQL root user `auth_socket` plugin use kar raha hai, jo password authentication allow nahi karta.

## Solution: Create Dedicated User

Backend ke liye dedicated MySQL user banaen:

### Option 1: Use Script (Recommended)

```bash
# Script download
cd ~
wget -O create-mysql-user.sh https://raw.githubusercontent.com/nurender/Siara/main/create-mysql-user.sh
chmod +x create-mysql-user.sh

# Run
sudo bash create-mysql-user.sh
```

### Option 2: Manual Steps

```bash
# Create user manually
sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS siara_events;
CREATE USER IF NOT EXISTS 'siara_user'@'localhost' IDENTIFIED BY 'siara_password_2024';
GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF

# Test new user
mysql -u siara_user -psiara_password_2024 -e "SELECT 1;"

# Update .env file
cd ~/siara-events/backend
nano .env
# Change:
#   DB_USER=siara_user
#   DB_PASSWORD=siara_password_2024
```

## Update .env File

```bash
cd ~/siara-events/backend
nano .env
```

Update these lines:
```
DB_USER=siara_user
DB_PASSWORD=siara_password_2024
DB_NAME=siara_events
```

## Setup Database Tables

```bash
cd ~/siara-events/backend
node database/setup.js
node database/setup-cms.js
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

## Verify

```bash
# Test new user
mysql -u siara_user -psiara_password_2024 -e "SELECT 1;"

# Test database
mysql -u siara_user -psiara_password_2024 -e "USE siara_events; SHOW TABLES;"

# Test backend
cd ~/siara-events/backend
node server.js
# Should show: ✅ MySQL Database connected successfully!
```

## Alternative: Fix Root User (If Needed)

Agar root user use karna hai:

```bash
sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;
EOF
```

**Note:** MySQL 8.0+ mein `mysql_native_password` plugin load karna padega, ya dedicated user banana better hai.

---

**Recommended:** Dedicated user (`siara_user`) use karein - yeh safer aur better practice hai.

