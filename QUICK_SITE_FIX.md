# ⚡ Quick Site Fix - Server Par

## Step 1: SSH Karein
```bash
ssh nurie@170.64.205.179
```

## Step 2: Script Download & Run
```bash
cd ~/siara-events

# Latest code pull karein
git pull origin main

# Fix script run karein
chmod +x fix-site-not-running.sh
bash fix-site-not-running.sh
```

## Ya Manual Quick Fix

```bash
cd ~/siara-events

# NVM load
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# 1. PM2 restart
pm2 restart all

# 2. MySQL test
mysql -u root -e "SELECT 1;" || echo "MySQL issue - check FIX_ROOT_ACCESS_DENIED.md"

# 3. Backend check
pm2 logs siara-backend --lines 10 --nostream
curl http://localhost:5000/api/health

# 4. Frontend check
pm2 logs siara-frontend --lines 10 --nostream
curl -I http://localhost:3000
```

## Agar Kuch Bhi Kaam Na Kare

```bash
# Complete restart
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 delete all
pm2 start ecosystem.config.js

# Wait
sleep 5

# Check
pm2 status
curl http://localhost:5000/api/health
curl -I http://localhost:3000
```

---

**Detailed guide:** `SITE_NOT_RUNNING_FIX.md` dekhein

