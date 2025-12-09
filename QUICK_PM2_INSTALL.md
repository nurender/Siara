# ⚡ Quick PM2 Install & Setup

## Problem
PM2 command not found - needs to be installed after Node.js is working.

## Quick Fix

### Step 1: Complete Setup (Recommended)
```bash
cd ~/siara-events
git pull origin main
chmod +x complete-setup.sh
bash complete-setup.sh
```

Yeh script sab kuch setup karega:
- NVM (if not installed)
- Node.js 18
- PM2
- Environment variables
- MySQL check
- Database setup
- Start backend & frontend

### Step 2: Manual Install (If Script Fails)

```bash
# 1. Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# 2. Verify Node
node -v
npm -v

# 3. Install PM2
npm install -g pm2

# 4. Verify PM2
pm2 --version

# 5. Add to .bashrc (so it loads automatically)
echo '' >> ~/.bashrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.bashrc
```

### Step 3: Start Services
```bash
cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Start with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status
```

---

## If Node Still Gets Killed

Agar `node -v` bhi "Killed" dikhaye, to:

1. **Check memory:**
   ```bash
   free -h
   ```

2. **Check disk:**
   ```bash
   df -h
   ```

3. **Run fix script:**
   ```bash
   cd ~/siara-events
   git pull origin main
   chmod +x fix-node-killed.sh
   bash fix-node-killed.sh
   ```

---

## After PM2 Install

### Start Services
```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 start ecosystem.config.js
pm2 status
```

### Check Logs
```bash
pm2 logs siara-backend
pm2 logs siara-frontend
```

### Restart Services
```bash
pm2 restart all
```

---

**Note:** Agar Node commands still "Killed" ho rahe hain, to server par memory issue hai. `free -h` check karein aur system admin se contact karein.

