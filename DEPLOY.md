# 🚀 Siara Events - Complete Deployment Guide

## 📋 Prerequisites

- Server with SSH access
- Root or sudo access (for MySQL installation if needed)
- GitHub repository: https://github.com/nurender/Siara

---

## 🎯 Quick Start (New Server)

### Step 1: Connect to Server
```bash
ssh your-user@your-server-ip
```

### Step 2: Install Node.js (via NVM - No sudo needed)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Install PM2
npm install -g pm2

# Verify
node --version  # Should show v20.x.x
npm --version
pm2 --version
```

### Step 3: Install MySQL (if not installed)
```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Step 4: Clone Repository
```bash
cd ~
git clone https://github.com/nurender/Siara.git siara-events
cd siara-events
```

### Step 5: Setup Environment Variables
```bash
# Create .env file in root
nano .env
```

**Add this content:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://your-server-ip:3000
NEXT_PUBLIC_API_URL=http://your-server-ip:5000
```

```bash
# Copy to backend
cp .env backend/.env
```

### Step 6: Setup Database
```bash
cd backend

# Create database
mysql -u root -p
# In MySQL prompt:
CREATE DATABASE siara_events;
EXIT;

# Run setup scripts
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js

cd ..
```

### Step 7: Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### Step 8: Build Application
```bash
npm run build
```

### Step 9: Start with PM2
```bash
# Create logs directory
mkdir -p logs

# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown (usually run the sudo command)
```

### Step 10: Verify Deployment
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Test backend API
curl http://localhost:5000/api/health

# Test frontend (in browser)
# http://your-server-ip:3000
```

---

## 🔄 Updating Existing Deployment

### Quick Update (After Code Changes)
```bash
ssh your-user@your-server-ip
cd ~/siara-events

# Pull latest code
git pull origin main

# Install any new dependencies
npm install
cd backend && npm install && cd ..

# Rebuild
npm run build

# Restart PM2
pm2 restart all
```

---

## 📁 Important Files & Scripts

### `ecosystem.config.js`
PM2 configuration file - manages both frontend and backend processes.

### `add-swap-and-setup.sh`
Complete setup script with swap creation (for low memory servers).

### `complete-setup.sh`
Complete setup script without swap (for servers with enough memory).

### `simple-fix.sh`
Quick fix script for common issues.

### `create-mysql-user.sh`
Script to create dedicated MySQL user (needs sudo).

### `sync-cms-to-server.sh`
Script to sync CMS content to server.

---

## 🛠️ Useful Commands

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs
pm2 logs siara-backend
pm2 logs siara-frontend

# Restart
pm2 restart all
pm2 restart siara-backend
pm2 restart siara-frontend

# Stop
pm2 stop all

# Delete
pm2 delete all

# Monitor resources
pm2 monit
```

### Database Commands
```bash
# Connect to MySQL
mysql -u root -p

# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check tables
mysql -u root -p siara_events -e "SHOW TABLES;"
```

### Troubleshooting
```bash
# Check if ports are in use
sudo lsof -i :3000
sudo lsof -i :5000

# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# View application logs
pm2 logs --lines 50
```

---

## 🌐 Access URLs

After deployment, access your application at:

- **Frontend:** http://your-server-ip:3000
- **Backend API:** http://your-server-ip:5000/api/health
- **Manager Panel:** http://your-server-ip:3000/manager

---

## 🔒 Security Notes

1. **Change JWT_SECRET** in `.env` to a strong random string
2. **Set MySQL password** - Don't leave it empty in production
3. **Setup firewall** - Only open necessary ports (22, 80, 443, 3000, 5000)
4. **Use HTTPS** - Setup SSL certificate with Let's Encrypt
5. **Regular updates** - Keep dependencies updated

---

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | Database password | `your_password` |
| `DB_NAME` | Database name | `siara_events` |
| `PORT` | Backend port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `JWT_SECRET` | JWT secret key | `random_string_here` |
| `FRONTEND_URL` | Frontend URL | `http://your-ip:3000` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://your-ip:5000` |

---

## 🆘 Common Issues

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### PM2 Not Found
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm install -g pm2
```

### Database Connection Error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SHOW DATABASES;"

# Check .env file
cat ~/siara-events/.env
cat ~/siara-events/backend/.env
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install && cd ..

# Rebuild
npm run build
```

---

## 📞 Support

For issues or questions:
1. Check PM2 logs: `pm2 logs`
2. Check application logs in `~/siara-events/logs/`
3. Verify environment variables
4. Check database connection

---

**Last Updated:** 2024
**Repository:** https://github.com/nurender/Siara

