# 🚀 Deployment Summary - Siara Events

## Files Created for Deployment

1. **`deploy.sh`** - Full deployment script
2. **`quick-deploy.sh`** - Quick update script
3. **`ecosystem.config.js`** - PM2 configuration
4. **`DEPLOYMENT.md`** - Detailed deployment guide
5. **`QUICK_DEPLOY.md`** - Quick step-by-step guide

## Quick Start (TL;DR)

### On Server (nurie@170.64.205.179):

```bash
# 1. Connect
ssh nurie@170.64.205.179

# 2. Upload code (from local machine using SCP or Git)

# 3. Setup (first time only)
cd ~/siara-events
chmod +x *.sh
nano .env  # Add environment variables
nano backend/.env  # Add same variables

# 4. Database setup
cd backend
mysql -u root -p
# CREATE DATABASE siara_events;
# EXIT;
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js

# 5. Install & Build
cd ..
npm install
cd backend && npm install && cd ..
npm run build

# 6. Start with PM2
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions

# 7. Done! Access at:
# Frontend: http://170.64.205.179:3000
# Backend: http://170.64.205.179:5000/api/health
```

## Environment Variables Needed

Create `.env` in root and `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=your_secret_key
FRONTEND_URL=http://170.64.205.179:3000
NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
```

## For Updates

```bash
cd ~/siara-events
./quick-deploy.sh
```

## Check Status

```bash
pm2 status
pm2 logs
```

