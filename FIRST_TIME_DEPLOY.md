# 🚀 First Time Deployment Guide - Siara Events

## Server: nurie@170.64.205.179
## Repository: https://github.com/nurender/Siara

## Step 1: Connect to Server

```bash
ssh nurie@170.64.205.179
```

## Step 2: Install Required Software (First Time Only)

```bash
# Update system
sudo apt update

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install MySQL (if not installed)
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

## Step 3: Setup Database

```bash
# Login to MySQL
sudo mysql -u root -p

# In MySQL prompt, run:
CREATE DATABASE IF NOT EXISTS siara_events;
CREATE USER IF NOT EXISTS 'siara_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 4: Clone and Deploy

```bash
# Clone repository
cd ~
git clone https://github.com/nurender/Siara.git siara-events
cd siara-events

# Make deployment script executable
chmod +x server-deploy.sh

# Create .env file
nano .env
```

**Add this content to .env:**
```env
DB_HOST=localhost
DB_USER=siara_user
DB_PASSWORD=your_secure_password
DB_NAME=siara_events

PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://170.64.205.179:3000

NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
```

**Save and exit (Ctrl+X, then Y, then Enter)**

```bash
# Copy .env to backend
cp .env backend/.env

# Run database setup
cd backend
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js
cd ..

# Run deployment script
./server-deploy.sh
```

## Step 5: Setup PM2 Auto-Start (First Time Only)

```bash
# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions shown (usually copy and run the sudo command)
```

## Step 6: Setup Firewall (if needed)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 5000/tcp  # Backend
sudo ufw enable
```

## Step 7: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Test backend
curl http://localhost:5000/api/health

# Test in browser
# Frontend: http://170.64.205.179:3000
# Backend: http://170.64.205.179:5000/api/health
```

## ✅ Done!

Your application should now be running!

---

## For Future Updates

Simply run on the server:

```bash
cd ~/siara-events
./server-deploy.sh
```

Or manually:
```bash
cd ~/siara-events
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

## Troubleshooting

### Port already in use
```bash
sudo lsof -i :3000
sudo lsof -i :5000
# Kill process if needed: sudo kill -9 <PID>
```

### Database connection error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u siara_user -p siara_events
```

### PM2 issues
```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 logs
```

### View application logs
```bash
pm2 logs siara-backend
pm2 logs siara-frontend
# Or view file logs
tail -f logs/backend-error.log
tail -f logs/frontend-error.log
```

