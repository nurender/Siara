# 🔧 Fix Network Error - Database Connection Issue

## Problem
Backend database se connect nahi kar pa raha, isliye frontend ko "Network error" aa raha hai.

## Solution

### Step 1: MySQL Password Set Karein

SSH karein aur `.env` file me MySQL password add karein:

```bash
ssh nurie@170.64.205.179
cd ~/siara-events
nano .env
```

**`.env` file me ye line update karein:**
```env
DB_PASSWORD=apna_mysql_password_yaha
```

**Agar MySQL password nahi hai, to pehle set karein:**
```bash
sudo mysql
# MySQL prompt me:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'apna_password';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2: Backend .env Me Bhi Copy Karein
```bash
cp .env backend/.env
```

### Step 3: Database Create Karein
```bash
mysql -u root -p
# Password enter karein
# MySQL prompt me:
CREATE DATABASE IF NOT EXISTS siara_events;
EXIT;
```

### Step 4: Database Setup Run Karein
```bash
cd backend
node database/setup.js
node database/setup-cms.js
cd ..
```

### Step 5: Backend Restart Karein
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart siara-backend
```

### Step 6: Verify Karein
```bash
# Backend health check
curl http://localhost:5000/api/health

# PM2 status
pm2 status

# Logs check
pm2 logs siara-backend --lines 10
```

## Quick Fix Script

Agar password set kar diya hai, to ye script run karein:

```bash
ssh nurie@170.64.205.179
cd ~/siara-events

# Password .env me set karein (nano .env)
# Phir:
cp .env backend/.env
cd backend
node database/setup.js
cd ..
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart siara-backend
```

## Check Karne Ke Liye

```bash
# Backend running hai?
pm2 status siara-backend

# Database connect ho raha hai?
mysql -u root -p -e "USE siara_events; SHOW TABLES;"

# API respond kar raha hai?
curl http://localhost:5000/api/health
```

---

**Note:** Agar MySQL install nahi hai, to pehle install karein:
```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

