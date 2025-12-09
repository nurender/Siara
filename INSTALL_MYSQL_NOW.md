# 🚀 MySQL Installation - Step by Step

## MySQL Install Karein

Server par SSH karein aur ye commands run karein:

```bash
ssh nurie@170.64.205.179

# 1. Update packages
sudo apt update

# 2. Install MySQL
sudo apt install mysql-server -y

# 3. Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 4. Check status
sudo systemctl status mysql
```

## Database Setup

MySQL install hone ke baad:

```bash
cd ~/siara-events/backend

# 1. Create database
mysql -u root -e "CREATE DATABASE siara_events;"

# 2. Setup database tables
node database/setup.js
node database/setup-cms.js

# 3. Seed data (optional)
node database/seed.js
node database/seed-cms.js
```

## Backend Restart

```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Restart backend
pm2 delete siara-backend
pm2 start ecosystem.config.js --only siara-backend

# Check
sleep 3
pm2 status
curl http://localhost:5000/api/health
```

## Complete Command (Ek Sath)

```bash
# MySQL install
sudo apt update && sudo apt install mysql-server -y && sudo systemctl start mysql && sudo systemctl enable mysql

# Database setup
cd ~/siara-events/backend
mysql -u root -e "CREATE DATABASE siara_events;"
node database/setup.js
node database/setup-cms.js

# Backend restart
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart siara-backend
```

## Verify

```bash
# MySQL test
mysql -u root -e "SELECT 1;"

# Database check
mysql -u root -e "USE siara_events; SHOW TABLES;"

# Backend test
curl http://localhost:5000/api/health
```

---

**Note:** Sudo password chahiye MySQL install karne ke liye. Agar password nahi pata, to server admin se contact karein.

