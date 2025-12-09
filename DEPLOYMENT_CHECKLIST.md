# ✅ Deployment Checklist - Siara Events

## 🎯 New Server Par Deploy Karne Ke Liye

### Step 1: Server Connect Karein
```bash
ssh your-user@your-server-ip
```

### Step 2: Node.js Install Karein (NVM se - Sudo ki zaroorat nahi)
```bash
# NVM install
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Node.js 20 install
nvm install 20
nvm use 20
nvm alias default 20

# PM2 install
npm install -g pm2

# Verify
node --version  # v20.x.x aana chahiye
pm2 --version
```

### Step 3: MySQL Install Karein (Agar nahi hai)
```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Step 4: Code Clone Karein
```bash
cd ~
git clone https://github.com/nurender/Siara.git siara-events
cd siara-events
```

### Step 5: Environment Variables Setup
```bash
# .env file banayein
nano .env
```

**Ye content add karein:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=apna_mysql_password
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=apna_super_secret_key_yaha_dalein
FRONTEND_URL=http://your-server-ip:3000
NEXT_PUBLIC_API_URL=http://your-server-ip:5000
```

```bash
# Backend me bhi copy karein
cp .env backend/.env
```

### Step 6: Database Setup
```bash
cd backend

# Database create karein
mysql -u root -p
# MySQL prompt me:
CREATE DATABASE siara_events;
EXIT;

# Setup scripts run karein
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js

cd ..
```

### Step 7: Dependencies Install
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### Step 8: Build Karein
```bash
npm run build
```

### Step 9: PM2 Se Start Karein
```bash
# Logs folder banayein
mkdir -p logs

# Applications start karein
pm2 start ecosystem.config.js

# Save karein
pm2 save

# Auto-start on boot
pm2 startup
# Jo command dikhe, wo run karein (usually sudo command)
```

### Step 10: Verify Karein
```bash
# Status check
pm2 status

# Logs dekhne
pm2 logs

# API test
curl http://localhost:5000/api/health
```

---

## 🔄 Update Karne Ke Liye (Code Change Ke Baad)

```bash
ssh your-user@your-server-ip
cd ~/siara-events

# Latest code pull
git pull origin main

# Dependencies update
npm install
cd backend && npm install && cd ..

# Rebuild
npm run build

# Restart
pm2 restart all
```

**Ya phir script use karein:**
```bash
bash update-and-build.sh
pm2 restart all
```

---

## 📋 Quick Checklist

### First Time Deployment:
- [ ] Node.js 20 install (NVM se)
- [ ] PM2 install
- [ ] MySQL install (agar nahi hai)
- [ ] Code clone (GitHub se)
- [ ] `.env` file create (root aur backend me)
- [ ] Database create (MySQL me)
- [ ] Database setup scripts run
- [ ] Dependencies install (npm install)
- [ ] Build (npm run build)
- [ ] PM2 start (pm2 start ecosystem.config.js)
- [ ] PM2 save (pm2 save)
- [ ] PM2 startup setup (pm2 startup)

### Regular Updates:
- [ ] Git pull (latest code)
- [ ] npm install (new dependencies)
- [ ] npm run build (rebuild)
- [ ] pm2 restart all (restart applications)

---

## 🌐 Access URLs

Deployment ke baad:
- **Frontend:** http://your-server-ip:3000
- **Backend API:** http://your-server-ip:5000/api/health
- **Manager Panel:** http://your-server-ip:3000/manager

---

## 🛠️ Important Commands

```bash
# PM2 Status
pm2 status

# PM2 Logs
pm2 logs
pm2 logs siara-backend
pm2 logs siara-frontend

# PM2 Restart
pm2 restart all

# PM2 Stop
pm2 stop all

# Database Check
mysql -u root -p -e "SHOW DATABASES;"
mysql -u root -p siara_events -e "SHOW TABLES;"
```

---

## ⚠️ Important Notes

1. **JWT_SECRET** - Strong random string use karein production me
2. **DB_PASSWORD** - MySQL password set karein (empty mat chhodein)
3. **Firewall** - Ports 3000 aur 5000 open karein
4. **HTTPS** - Production me SSL certificate setup karein

---

**Detailed Guide:** `DEPLOY.md` file me dekhein

