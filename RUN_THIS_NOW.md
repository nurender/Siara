# 🚀 MySQL Install - Run This Now

## Quick Install (Sudo Password Required)

Server par SSH karein aur ye command run karein:

```bash
ssh nurie@170.64.205.179

# Script download (agar nahi hai)
cd ~
wget https://raw.githubusercontent.com/nurender/Siara/main/install-mysql-now.sh
chmod +x install-mysql-now.sh

# Run with sudo (password puchhega)
sudo bash install-mysql-now.sh
```

## Ya Manual Steps

```bash
# 1. MySQL Install
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# 2. MySQL Root Setup
sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS siara_events;
EXIT;
EOF

# 3. Database Setup
cd ~/siara-events/backend
node database/setup.js
node database/setup-cms.js

# 4. Backend Restart
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart siara-backend

# 5. Check
pm2 status
curl http://localhost:5000/api/health
```

## Verify

```bash
# MySQL test
mysql -u root -e "SELECT 1;"

# Database check
mysql -u root -e "USE siara_events; SHOW TABLES;"

# Backend test
curl http://localhost:5000/api/health
pm2 logs siara-backend --lines 20
```

---

**Note:** Sudo password chahiye. Agar password nahi pata, to server admin se contact karein.

