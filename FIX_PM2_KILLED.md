# 🔧 Fix PM2 Commands Being Killed

## Problem
PM2 commands are showing "Killed" - this usually means:
1. Memory issue (OOM killer)
2. PM2 not properly installed
3. NVM/Node path issues

## Solution

### Step 1: Check System Resources
```bash
free -h
df -h
```

### Step 2: Fix MySQL First (Needs Sudo Password)
```bash
cd ~/siara-events

# Create MySQL user (needs sudo)
sudo bash create-mysql-user.sh
```

**Agar sudo password nahi hai, to manually:**
```bash
sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS siara_events;
CREATE USER IF NOT EXISTS 'siara_user'@'localhost' IDENTIFIED BY 'siara_password_2024';
GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF
```

### Step 3: Update .env Manually
```bash
cd ~/siara-events/backend
nano .env
```

**Change these lines:**
```env
DB_USER=siara_user
DB_PASSWORD=siara_password_2024
```

### Step 4: Test NVM/Node (Without PM2)
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Test
node -v
npm -v
which node
which npm
```

### Step 5: Reinstall PM2 (If Needed)
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Remove old PM2
npm uninstall -g pm2

# Install fresh
npm install -g pm2

# Test
pm2 --version
```

### Step 6: Setup Database Tables
```bash
cd ~/siara-events/backend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

node database/setup.js
node database/setup-cms.js
```

### Step 7: Start Backend Manually (Test)
```bash
cd ~/siara-events/backend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Test backend directly
node server.js
```

**Agar yeh kaam kare (database connected dikhe), to Ctrl+C se stop karein aur PM2 se start karein.**

### Step 8: Start with PM2 (One by One)
```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Delete old processes
pm2 delete all 2>/dev/null || true

# Start backend only
pm2 start ecosystem.config.js --only siara-backend

# Wait and check
sleep 5
pm2 status
pm2 logs siara-backend --lines 20 --nostream

# If backend OK, start frontend
pm2 start ecosystem.config.js --only siara-frontend

# Final check
sleep 3
pm2 status
```

### Step 9: Test APIs
```bash
curl http://localhost:5000/api/health
curl -I http://localhost:3000
```

---

## Alternative: If PM2 Still Gets Killed

### Option 1: Use nohup Instead
```bash
cd ~/siara-events/backend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Backend
nohup node server.js > backend.log 2>&1 &

# Frontend (separate terminal)
cd ~/siara-events
nohup npm run start > frontend.log 2>&1 &
```

### Option 2: Check Memory Limits
```bash
# Check if OOM killer is active
dmesg | grep -i "killed process"

# Check memory
free -h
```

### Option 3: Increase Swap (If Low Memory)
```bash
# Check swap
swapon --show

# If no swap, create (needs sudo)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Quick Test Script

```bash
cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Test each step
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "PM2: $(pm2 --version 2>&1)"

# Test MySQL
mysql -u siara_user -psiara_password_2024 -e "SELECT 1;" && echo "MySQL OK" || echo "MySQL Failed"

# Test backend directly
cd backend
timeout 5 node server.js || echo "Backend test complete"
```

---

**Note:** Agar PM2 commands consistently "Killed" ho rahe hain, to server par memory issue ho sakta hai. System admin se contact karein.

