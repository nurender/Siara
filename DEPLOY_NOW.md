# 🚀 Deploy Now - Quick Commands

## Server: nurie@170.64.205.179
## Repository: https://github.com/nurender/Siara

## One-Time Setup (First Time Only)

SSH into server aur ye commands run karein:

```bash
# 1. Connect
ssh nurie@170.64.205.179

# 2. Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# 3. Setup MySQL Database
sudo mysql -u root -p
# MySQL me ye commands:
CREATE DATABASE siara_events;
CREATE USER 'siara_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 4. Clone & Setup
cd ~
git clone https://github.com/nurender/Siara.git siara-events
cd siara-events

# 5. Create .env file
nano .env
# Add these lines:
# DB_HOST=localhost
# DB_USER=siara_user
# DB_PASSWORD=your_password
# DB_NAME=siara_events
# PORT=5000
# NODE_ENV=production
# JWT_SECRET=your_secret_key_here
# FRONTEND_URL=http://170.64.205.179:3000
# NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
# Save: Ctrl+X, Y, Enter

# 6. Copy .env to backend
cp .env backend/.env

# 7. Setup Database
cd backend
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js
cd ..

# 8. Deploy
chmod +x server-deploy.sh
./server-deploy.sh

# 9. Setup Auto-start
pm2 startup
# Follow instructions shown
```

## Future Updates (After First Time)

Bas ye command run karein:

```bash
ssh nurie@170.64.205.179
cd ~/siara-events
./server-deploy.sh
```

Ya manually:

```bash
cd ~/siara-events
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

## Check Status

```bash
pm2 status
pm2 logs
```

## Access Application

- Frontend: http://170.64.205.179:3000
- Backend API: http://170.64.205.179:5000/api/health

---

**Detailed Guide:** `FIRST_TIME_DEPLOY.md` file dekhein

