# 🚀 Deploy from GitHub - Siara Events

## Automated Deployment

### Option 1: Using Deployment Script (Recommended)

From your local machine, run:

```bash
# Make script executable (Linux/Mac)
chmod +x deploy-from-github.sh

# Run deployment
./deploy-from-github.sh
```

**For Windows (PowerShell):**
```powershell
# Use Git Bash or WSL to run the script
bash deploy-from-github.sh
```

### Option 2: Manual Deployment

#### Step 1: Connect to Server
```bash
ssh nurie@170.64.205.179
```

#### Step 2: Clone/Update Repository
```bash
# If first time
git clone https://github.com/nurender/Siara.git ~/siara-events
cd ~/siara-events

# If already exists, update
cd ~/siara-events
git pull origin main
```

#### Step 3: Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

#### Step 4: Setup Environment Variables
```bash
# Create .env file in root
nano .env
```

Add:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key
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

#### Step 5: Setup Database (First Time Only)
```bash
cd backend
mysql -u root -p
# In MySQL:
CREATE DATABASE IF NOT EXISTS siara_events;
EXIT;

# Run setup scripts
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js
cd ..
```

#### Step 6: Build Application
```bash
npm run build
```

#### Step 7: Start with PM2
```bash
# Install PM2 if not installed
npm install -g pm2

# Create logs directory
mkdir -p logs

# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot (first time only)
pm2 startup
# Follow the instructions shown
```

#### Step 8: Verify Deployment
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Test API
curl http://localhost:5000/api/health
```

## For Future Updates

Simply run:
```bash
cd ~/siara-events
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

Or use the quick deploy script:
```bash
cd ~/siara-events
./quick-deploy.sh
```

## Troubleshooting

### Git Pull Fails
```bash
# If you have local changes
cd ~/siara-events
git stash
git pull origin main
git stash pop
```

### PM2 Not Running
```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process if needed
sudo kill -9 <PID>
```

### Database Connection Error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

## Environment Variables Checklist

Make sure these are set in both `.env` and `backend/.env`:

- ✅ `DB_HOST` - Database host (usually `localhost`)
- ✅ `DB_USER` - Database user (usually `root`)
- ✅ `DB_PASSWORD` - Database password
- ✅ `DB_NAME` - Database name (`siara_events`)
- ✅ `PORT` - Backend port (usually `5000`)
- ✅ `NODE_ENV` - Environment (`production`)
- ✅ `JWT_SECRET` - Secret key for JWT tokens
- ✅ `FRONTEND_URL` - Frontend URL
- ✅ `NEXT_PUBLIC_API_URL` - Backend API URL

## Quick Commands Reference

```bash
# View PM2 status
pm2 status

# View logs
pm2 logs siara-backend
pm2 logs siara-frontend

# Restart all
pm2 restart all

# Stop all
pm2 stop all

# Monitor resources
pm2 monit

# View detailed info
pm2 show siara-backend
pm2 show siara-frontend
```

