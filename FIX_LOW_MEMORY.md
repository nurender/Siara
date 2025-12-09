# 🔧 Fix Low Memory & No Swap Issue

## Problem
- Memory: Only 285MB free (low)
- Swap: 0B (no swap configured)
- Node.js getting killed by OOM (Out of Memory) killer

## Solution: Add Swap Space

### Quick Fix Script
```bash
cd ~/siara-events
git pull origin main
chmod +x add-swap-and-setup.sh
bash add-swap-and-setup.sh
```

Yeh script:
1. 2GB swap file create karega
2. Swap activate karega
3. Node.js install karega
4. PM2 install karega
5. Services start karega

### Manual Fix

#### Step 1: Create Swap File (Needs Sudo)
```bash
# Create 2GB swap file
sudo fallocate -l 2G /swapfile

# Set permissions
sudo chmod 600 /swapfile

# Format as swap
sudo mkswap /swapfile

# Activate swap
sudo swapon /swapfile

# Verify
free -h
```

#### Step 2: Make Swap Permanent
```bash
# Add to /etc/fstab
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify it's in fstab
cat /etc/fstab | grep swapfile
```

#### Step 3: Verify Swap
```bash
free -h
# Should show Swap: 2.0Gi (or similar)
```

#### Step 4: Install Node & PM2
```bash
# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install Node
nvm install 18
nvm use 18
nvm alias default 18

# Install PM2
npm install -g pm2

# Test
node -v
npm -v
pm2 --version
```

#### Step 5: Start Services
```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 start ecosystem.config.js
pm2 status
```

---

## Why Swap is Important

Without swap:
- When memory runs out, Linux OOM killer kills processes
- Node.js gets killed when it tries to use memory
- PM2 commands also get killed

With swap:
- System can use disk space as virtual memory
- Processes don't get killed when memory is low
- System can handle memory spikes

---

## Swap Size Recommendations

- **Minimum:** 1GB (for small servers)
- **Recommended:** 2GB (for this setup)
- **Maximum:** 4GB (usually enough)

Current server has 1.9GB RAM, so 2GB swap is perfect.

---

## Verify After Setup

```bash
# Check swap
free -h

# Check Node
node -v

# Check PM2
pm2 --version

# Check services
pm2 status
curl http://localhost:5000/api/health
```

---

## If Still Getting Killed

1. **Increase swap size:**
   ```bash
   sudo swapoff /swapfile
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

2. **Check what's using memory:**
   ```bash
   ps aux --sort=-%mem | head -10
   ```

3. **Check OOM logs:**
   ```bash
   dmesg | grep -i "out of memory"
   dmesg | grep -i "killed process"
   ```

---

**Note:** Swap is slower than RAM, but prevents processes from being killed. It's essential for low-memory servers.

