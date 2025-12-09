# 🔧 Backend Server Fix - Database Connection Error

## Problem
Backend server database se connect nahi kar pa raha, isliye API calls fail ho rahe hain.

## Quick Fix (Server Par)

### Step 1: SSH Karein
```bash
ssh nurie@170.64.205.179
```

### Step 2: MySQL Fix
```bash
cd ~/siara-events

# MySQL start karein (agar stopped hai)
sudo systemctl start mysql
sudo systemctl status mysql

# MySQL password remove karein (agar nahi chahiye)
sudo mysql
# MySQL prompt me:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Database Create
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"
```

### Step 4: Database Setup (Agar tables nahi hain)
```bash
cd backend
node database/setup.js
node database/setup-cms.js
cd ..
```

### Step 5: .env Update
```bash
# .env me DB_PASSWORD empty rakhein
nano .env
# DB_PASSWORD= (empty line)

# Backend me copy
cp .env backend/.env
```

### Step 6: Backend Restart
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Delete and restart
pm2 delete siara-backend
pm2 start ecosystem.config.js --only siara-backend

# Wait 5 seconds
sleep 5

# Check
pm2 status siara-backend
curl http://localhost:5000/api/health
```

### Step 7: Test API
```bash
# Health check
curl http://localhost:5000/api/health

# Services API
curl http://localhost:5000/api/cms/services
```

---

## Quick Script (Sab Ek Sath)

```bash
ssh nurie@170.64.205.179
cd ~/siara-events

# Run fix script
chmod +x ~/fix-backend-server.sh
bash ~/fix-backend-server.sh
```

---

## Manual Fix (Agar Script Kaam Na Kare)

```bash
ssh nurie@170.64.205.179
cd ~/siara-events

# 1. MySQL start
sudo systemctl start mysql

# 2. MySQL password fix
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"

# 3. Database create
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"

# 4. .env update
sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env
cp .env backend/.env

# 5. Setup database (agar tables nahi hain)
cd backend
node database/setup.js
node database/setup-cms.js
cd ..

# 6. Restart backend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 delete siara-backend
pm2 start ecosystem.config.js --only siara-backend

# 7. Check
sleep 5
pm2 status
curl http://localhost:5000/api/health
```

---

## Verify

Browser me ye URLs try karein:
- http://170.64.205.179:5000/api/health
- http://170.64.205.179:5000/api/cms/services

Agar yeh respond kare, to backend theek hai!

---

## Common Issues

### MySQL Not Running
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### MySQL Password Issue
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;
```

### Database Tables Missing
```bash
cd ~/siara-events/backend
node database/setup.js
node database/setup-cms.js
```

### PM2 Not Found
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

