# 🔧 Fix siara-backend Errored Status

## Problem
`siara-backend` PM2 me `errored` status me hai - database connection fail ho raha hai.

## Quick Fix

### Option 1: Script Use Karein (Recommended)
```bash
ssh nurie@170.64.205.179
chmod +x ~/fix-backend-error.sh
bash ~/fix-backend-error.sh
```

### Option 2: Manual Fix

```bash
ssh nurie@170.64.205.179
cd ~/siara-events

# 1. MySQL start karein
sudo systemctl start mysql
sudo systemctl status mysql

# 2. MySQL password fix
sudo mysql
# MySQL prompt me:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;

# 3. Database create
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"

# 4. Database setup (agar tables nahi hain)
cd backend
node database/setup.js
node database/setup-cms.js
cd ..

# 5. .env update
nano .env
# DB_PASSWORD= (empty rakhein)
cp .env backend/.env

# 6. Backend restart
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 delete siara-backend
pm2 start ecosystem.config.js --only siara-backend

# 7. Check
sleep 5
pm2 status
curl http://localhost:5000/api/health
```

## Step-by-Step Explanation

### Step 1: MySQL Service
```bash
sudo systemctl start mysql
```
MySQL service running honi chahiye.

### Step 2: MySQL Password
```bash
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
```
Password authentication fix karein.

### Step 3: Database
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"
```
Database create karein.

### Step 4: Database Tables
```bash
cd backend
node database/setup.js
node database/setup-cms.js
```
Tables create karein (agar nahi hain).

### Step 5: Environment Variables
```bash
# .env me DB_PASSWORD empty rakhein
DB_PASSWORD=
```
Backend me bhi copy karein.

### Step 6: PM2 Restart
```bash
pm2 delete siara-backend
pm2 start ecosystem.config.js --only siara-backend
```
Fresh start karein.

## Verify

```bash
# PM2 Status
pm2 status

# Backend Health
curl http://localhost:5000/api/health

# Services API
curl http://localhost:5000/api/cms/services
```

## Expected Output

After fix:
- ✅ `siara-backend` status: `online` (green)
- ✅ API responds: `{"status":"ok",...}`
- ✅ No database connection errors in logs

## Troubleshooting

### MySQL Not Starting
```bash
sudo systemctl status mysql
sudo journalctl -u mysql -n 20
```

### Database Connection Still Failing
```bash
# Check .env
cat ~/siara-events/backend/.env | grep DB_

# Test MySQL connection
mysql -u root -e "SHOW DATABASES;"

# Check backend logs
pm2 logs siara-backend --lines 20
```

### PM2 Not Found
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

---

**Quick Command:**
```bash
ssh nurie@170.64.205.179 && bash ~/fix-backend-error.sh
```

