# 🔧 Site Not Running - Complete Fix Guide

## Quick Fix (Server Par)

### Step 1: SSH Karein
```bash
ssh nurie@170.64.205.179
```

### Step 2: Fix Script Run Karein
```bash
cd ~/siara-events

# Script download karein (agar nahi hai)
wget -O fix-site-not-running.sh https://raw.githubusercontent.com/nurender/Siara/main/fix-site-not-running.sh
chmod +x fix-site-not-running.sh

# Run karein
bash fix-site-not-running.sh
```

## Manual Fix (Step by Step)

### 1. PM2 Status Check
```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 status
```

**Agar processes stopped/errored hain:**
```bash
pm2 restart all
```

### 2. MySQL Check
```bash
mysql -u root -e "SELECT 1;"
```

**Agar error aaye:**
```bash
# MySQL start karein
sudo systemctl start mysql

# Ya password fix karein
sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
EXIT;
EOF
```

### 3. Database Check
```bash
mysql -u root -e "USE siara_events; SHOW TABLES;"
```

**Agar database nahi hai:**
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS siara_events;"
cd backend
node database/setup.js
node database/setup-cms.js
cd ..
```

### 4. Backend .env Check
```bash
cd ~/siara-events/backend
cat .env
```

**Required fields:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Empty ya password
DB_NAME=siara_events
PORT=5000
JWT_SECRET=siara_events_super_secret_jwt_key_2024_change_this_in_production
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
FRONTEND_URL=http://170.64.205.179:3000
```

**Agar missing hai:**
```bash
cd ~/siara-events
cp .env backend/.env
nano backend/.env  # Edit karein agar zaroorat ho
```

### 5. Backend Restart
```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 delete siara-backend
pm2 start ecosystem.config.js --only siara-backend

# Wait 3 seconds
sleep 3

# Check
pm2 status siara-backend
pm2 logs siara-backend --lines 10 --nostream
curl http://localhost:5000/api/health
```

**Agar backend errored hai:**
```bash
# Check logs
pm2 logs siara-backend --lines 50

# Common errors:
# - Database connection: MySQL fix karein (step 2)
# - Missing JWT_EXPIRES_IN: .env me add karein
# - Port already in use: pm2 delete siara-backend, phir restart
```

### 6. Frontend Check
```bash
cd ~/siara-events

# Check if built
ls -la .next

# Agar nahi hai, build karein
npm run build
```

### 7. Frontend Restart
```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 delete siara-frontend
pm2 start ecosystem.config.js --only siara-frontend

# Wait 3 seconds
sleep 3

# Check
pm2 status siara-frontend
curl -I http://localhost:3000
```

### 8. Final Verification
```bash
# PM2 Status
pm2 status

# Backend Test
curl http://localhost:5000/api/health
curl http://localhost:5000/api/cms/pages

# Frontend Test (Browser me)
# http://170.64.205.179:3000
```

## Common Issues & Solutions

### Issue 1: PM2 Processes Stopped
```bash
pm2 restart all
pm2 save
pm2 startup  # Agar auto-start chahiye
```

### Issue 2: Database Connection Failed
- MySQL service check: `sudo systemctl status mysql`
- MySQL password fix: `sudo mysql` → `ALTER USER 'root'@'localhost' IDENTIFIED BY '';`
- Database create: `mysql -u root -e "CREATE DATABASE siara_events;"`
- See: `FIX_ROOT_ACCESS_DENIED.md`

### Issue 3: Backend 500 Error
- Check `.env` file: `JWT_EXPIRES_IN=7d` must be present
- Check database connection
- Check logs: `pm2 logs siara-backend --lines 50`

### Issue 4: Frontend Not Loading
- Rebuild: `npm run build`
- Check `.env`: `NEXT_PUBLIC_API_URL` must be set
- Restart: `pm2 restart siara-frontend`

### Issue 5: Network Error (localhost:5000)
- Frontend `.env` me: `NEXT_PUBLIC_API_URL=http://170.64.205.179:5000`
- Rebuild frontend: `npm run build` (important!)
- Restart: `pm2 restart siara-frontend`

## Quick Commands Reference

```bash
# PM2
pm2 status
pm2 restart all
pm2 logs siara-backend
pm2 logs siara-frontend

# MySQL
mysql -u root -e "SELECT 1;"
mysql -u root -e "USE siara_events; SHOW TABLES;"

# Backend
curl http://localhost:5000/api/health
curl http://localhost:5000/api/cms/pages

# Frontend
curl -I http://localhost:3000

# Rebuild
cd ~/siara-events
npm run build
pm2 restart siara-frontend
```

## Still Not Working?

1. **Check PM2 Logs:**
   ```bash
   pm2 logs siara-backend --lines 100
   pm2 logs siara-frontend --lines 100
   ```

2. **Check Server Resources:**
   ```bash
   free -h  # Memory
   df -h    # Disk space
   ```

3. **Check Ports:**
   ```bash
   netstat -tulpn | grep -E '3000|5000'
   ```

4. **Check Nginx (if configured):**
   ```bash
   sudo systemctl status nginx
   ```

---

**Note:** Agar koi specific error aaye, to `pm2 logs` check karein aur us error ke according fix karein.

