# 🔧 Complete Fix - Network Error (localhost:5000)

## Problem
Frontend `localhost:5000` use kar raha hai, jabki server IP use hona chahiye. Backend database connection bhi fail ho raha hai.

## Solution (Server Par SSH Karke)

### Step 1: SSH Karein
```bash
ssh nurie@170.64.205.179
```

### Step 2: MySQL Password Fix
```bash
cd ~/siara-events

# Option A: Password remove karein (agar nahi chahiye)
sudo mysql
# MySQL prompt me:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;

# Option B: Ya password set karein
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'apna_password';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: .env File Update
```bash
cd ~/siara-events
nano .env
```

**Ye lines check karein:**
```env
DB_PASSWORD=          # Empty agar password nahi hai, ya password dalein
NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
FRONTEND_URL=http://170.64.205.179:3000
```

```bash
# Backend me copy
cp .env backend/.env
```

### Step 4: Database Create
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"
```

### Step 5: Backend Restart
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 restart siara-backend
sleep 3

# Check
curl http://localhost:5000/api/health
```

### Step 6: Frontend Rebuild (IMPORTANT!)
```bash
cd ~/siara-events

# Environment variables load karein
export $(cat .env | grep -v '^#' | xargs)

# Rebuild (yeh important hai - API URL embed hoga)
npm run build

# Restart
pm2 restart siara-frontend
```

### Step 7: Verify
```bash
# PM2 Status
pm2 status

# Backend test
curl http://localhost:5000/api/health

# Frontend test (browser me)
# http://170.64.205.179:3000
```

---

## Quick Script (Sab Ek Sath)

Server par ye script run karein:

```bash
ssh nurie@170.64.205.179
cd ~/siara-events

# MySQL fix (agar password nahi hai)
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"

# Database create
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"

# .env update
sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env
cp .env backend/.env

# Load env and rebuild
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export $(cat .env | grep -v '^#' | xargs)

# Restart backend
pm2 restart siara-backend
sleep 3

# Rebuild frontend
npm run build

# Restart frontend
pm2 restart siara-frontend

# Check
pm2 status
curl http://localhost:5000/api/health
```

---

## Important Notes

1. **Frontend Rebuild Zaroori Hai** - Next.js build time pe `NEXT_PUBLIC_API_URL` embed hota hai
2. **Server IP Use Karein** - Browser me `http://170.64.205.179:3000` use karein, `localhost` nahi
3. **Database Connection** - MySQL password sahi hona chahiye `.env` me

---

## Test URLs

Browser me ye URLs try karein:

- ✅ **Frontend:** http://170.64.205.179:3000
- ✅ **Backend API:** http://170.64.205.179:5000/api/health  
- ✅ **Manager Login:** http://170.64.205.179:3000/manager/login

❌ **Galat:** `localhost:5000` (yeh local machine par hai)

---

## Admin Login

- **Email:** admin@siara.com
- **Password:** admin123

