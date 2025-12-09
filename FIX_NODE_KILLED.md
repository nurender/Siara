# 🔧 Fix Node.js "Killed" Issue

## Problem
Node.js commands are being killed immediately - `node -v` shows "Killed"

## Possible Causes
1. **Out of Memory (OOM)** - System running out of memory
2. **Corrupted Node installation** - Node binary is corrupted
3. **NVM not loading properly** - Environment variables not set
4. **Disk space full** - No space to execute binaries

## Quick Fix

### Step 1: Check System Resources
```bash
# Memory
free -h

# Disk space
df -h

# OOM killer logs
dmesg | grep -i "killed process" | tail -10
```

### Step 2: Run Diagnostic
```bash
cd ~/siara-events
git pull origin main
chmod +x diagnose-node-issue.sh
bash diagnose-node-issue.sh
```

### Step 3: Fix Node Installation
```bash
cd ~/siara-events
git pull origin main
chmod +x fix-node-killed.sh
bash fix-node-killed.sh
```

## Manual Fix

### Option 1: Reinstall Node via NVM
```bash
# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Remove old Node
nvm uninstall 18 2>/dev/null
nvm uninstall 20 2>/dev/null

# Install fresh Node 18
nvm install 18
nvm use 18
nvm alias default 18

# Test
node -v
npm -v
```

### Option 2: If NVM Not Working
```bash
# Reinstall NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install Node
nvm install 18
nvm use 18
nvm alias default 18

# Add to .bashrc
echo '' >> ~/.bashrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.bashrc
```

### Option 3: If Memory Issue
```bash
# Check memory
free -h

# If memory is low, check what's using it
ps aux --sort=-%mem | head -10

# Kill unnecessary processes
# Or increase swap (needs sudo)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Option 4: Use System Node (If Available)
```bash
# Check if system Node exists
/usr/bin/node -v 2>/dev/null || echo "Not found"

# If found, create symlink
which node || (mkdir -p ~/.local/bin && ln -s /usr/bin/node ~/.local/bin/node)
```

## After Fixing Node

### Step 1: Verify Node Works
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

node -v
npm -v
which node
```

### Step 2: Install PM2
```bash
npm install -g pm2
pm2 --version
```

### Step 3: Fix MySQL (If Not Done)
```bash
cd ~/siara-events
sudo bash create-mysql-user.sh
```

### Step 4: Start Services
```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Setup database
cd backend
node database/setup.js
node database/setup-cms.js
cd ..

# Start with PM2
pm2 delete all 2>/dev/null
pm2 start ecosystem.config.js
pm2 status
```

## Troubleshooting

### If Node Still Gets Killed
1. **Check memory:** `free -h` - If less than 100MB free, that's the issue
2. **Check disk:** `df -h` - If /home is 100% full, that's the issue
3. **Check logs:** `dmesg | grep -i killed` - See what's being killed
4. **Contact admin:** If resources are too low, need server upgrade

### Alternative: Use nohup (If PM2 Fails)
```bash
cd ~/siara-events/backend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Start backend
nohup node server.js > backend.log 2>&1 &

# Start frontend (separate terminal)
cd ~/siara-events
nohup npm run start > frontend.log 2>&1 &
```

---

**Note:** Agar Node consistently "Killed" ho raha hai, to server par serious resource constraint hai. System admin se contact karein.

