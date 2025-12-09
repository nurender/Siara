# Quick Deployment Guide - Siara Events

## Server: nurie@170.64.205.179

### Step 1: Connect to Server
```bash
ssh nurie@170.64.205.179
```

### Step 2: Clone Repository on Server

```bash
# On server
cd ~
git clone https://github.com/nurender/Siara.git siara-events
cd siara-events
```

### Step 3: Initial Server Setup (First Time Only)

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MySQL (if not installed)
sudo apt update
sudo apt install mysql-server -y
```

### Step 4: Setup Environment Variables

```bash
cd ~/siara-events

# Create .env file for root
nano .env
```

**Add this content:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=siara_events

PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://170.64.205.179:3000

NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
```

```bash
# Create .env file for backend
cd backend
nano .env
# Add same content as above
cd ..
```

### Step 5: Setup Database

```bash
cd ~/siara-events/backend

# Create database
mysql -u root -p
# Enter your MySQL password when prompted

# In MySQL prompt:
CREATE DATABASE IF NOT EXISTS siara_events;
EXIT;

# Run database setup scripts
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js
```

### Step 6: Run Deployment Script

```bash
cd ~/siara-events

# Make deployment script executable
chmod +x server-deploy.sh

# Run deployment (this will install dependencies, build, and start PM2)
./server-deploy.sh

# Setup PM2 to start on boot (first time only)
pm2 startup
# Follow the instructions shown (usually: sudo env PATH=$PATH:...)
```

### Step 8: Verify Everything is Running

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Test backend API
curl http://localhost:5000/api/health

# Test frontend (in browser)
# http://170.64.205.179:3000
```

### Step 9: Setup Firewall (if needed)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3000/tcp   # Frontend
sudo ufw allow 5000/tcp   # Backend
sudo ufw enable
```

## For Future Updates

After making changes, simply run:

```bash
cd ~/siara-events
./quick-deploy.sh
```

Or manually:
```bash
cd ~/siara-events
git pull  # if using git
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

## Useful Commands

```bash
# View PM2 status
pm2 status

# View logs
pm2 logs siara-backend
pm2 logs siara-frontend

# Restart services
pm2 restart all

# Stop services
pm2 stop all

# Monitor resources
pm2 monit
```

## Troubleshooting

### Port already in use
```bash
sudo lsof -i :3000
sudo lsof -i :5000
# Kill the process if needed
```

### Database connection error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

### PM2 not starting
```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 logs
```

