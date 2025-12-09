# ⚡ Quick Fix - Connection Refused Error

## Problem
Backend database se connect nahi kar pa raha - MySQL password issue.

## Solution (3 Steps)

### Step 1: MySQL Password Set Karein

SSH karein:
```bash
ssh nurie@170.64.205.179
```

MySQL password check/set karein:
```bash
# Option A: Agar password nahi hai
sudo mysql
# MySQL prompt me:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;

# Option B: Agar password hai, to .env me add karein
cd ~/siara-events
nano .env
# DB_PASSWORD=apna_password_yaha
```

### Step 2: Database Create Karein
```bash
cd ~/siara-events

# Password ke bina
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"

# Ya password ke saath
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS siara_events;"
```

### Step 3: Backend Restart Karein
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# .env update karein (agar password set kiya)
nano .env
cp .env backend/.env

# Restart
pm2 restart siara-backend

# Check
curl http://localhost:5000/api/health
```

## Access URLs

**Important:** Local machine se access karne ke liye server IP use karein:

- ✅ **Frontend:** http://170.64.205.179:3000
- ✅ **Backend API:** http://170.64.205.179:5000/api/health
- ✅ **Manager:** http://170.64.205.179:3000/manager

❌ **Galat:** `localhost:5000` (yeh local machine par hai, server par nahi)

## Verify

```bash
# Server par check
curl http://localhost:5000/api/health

# Browser me check
http://170.64.205.179:5000/api/health
```

---

**Note:** Agar MySQL install nahi hai:
```bash
sudo apt update
sudo apt install mysql-server -y
```

