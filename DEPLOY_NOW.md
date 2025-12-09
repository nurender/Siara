# 🚀 Deploy Now - Quick Guide

## Repository
**GitHub:** https://github.com/nurender/Siara

## Server
**SSH:** `nurie@170.64.205.179`

---

## Quick Deploy (Automated)

### Windows (PowerShell):
```powershell
.\deploy-from-github.ps1
```

### Linux/Mac:
```bash
chmod +x deploy-from-github.sh
./deploy-from-github.sh
```

---

## Manual Deploy (Step by Step)

### 1. Connect to Server
```bash
ssh nurie@170.64.205.179
```

### 2. Clone/Update Repository
```bash
# First time
git clone https://github.com/nurender/Siara.git ~/siara-events
cd ~/siara-events

# Or update existing
cd ~/siara-events
git pull origin main
```

### 3. Setup Environment Variables
```bash
# Create .env in root
nano .env
```

**Add:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://170.64.205.179:3000
NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
```

```bash
# Create .env in backend
cd backend
nano .env
# Add same content
cd ..
```

### 4. Setup Database (First Time Only)
```bash
cd backend
mysql -u root -p
# CREATE DATABASE siara_events;
# EXIT;
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js
cd ..
```

### 5. Install & Build
```bash
npm install
cd backend && npm install && cd ..
npm run build
```

### 6. Start with PM2
```bash
# Install PM2 (if not installed)
npm install -g pm2

# Create logs directory
mkdir -p logs

# Start applications
pm2 start ecosystem.config.js
pm2 save

# Setup auto-start on boot (first time)
pm2 startup
# Follow instructions shown
```

### 7. Verify
```bash
pm2 status
curl http://localhost:5000/api/health
```

---

## For Updates (After Code Changes)

```bash
cd ~/siara-events
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

---

## Troubleshooting

### Check PM2 Status
```bash
pm2 status
pm2 logs
```

### Restart Services
```bash
pm2 restart all
```

### Check Ports
```bash
sudo lsof -i :3000
sudo lsof -i :5000
```

### Database Issues
```bash
sudo systemctl status mysql
mysql -u root -p -e "SHOW DATABASES;"
```

---

## Access URLs

- **Frontend:** http://170.64.205.179:3000
- **Backend API:** http://170.64.205.179:5000/api/health
- **Manager Panel:** http://170.64.205.179:3000/manager

---

## Important Notes

1. **First Time:** Make sure to setup database and environment variables
2. **PM2:** Keeps applications running even after SSH disconnect
3. **Updates:** Always run `git pull` before deploying updates
4. **Logs:** Check `pm2 logs` if something goes wrong
