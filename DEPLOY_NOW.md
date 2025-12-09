# 🚀 Quick Deployment Guide

## Option 1: Automated Deployment (Recommended)

### From Your Local Machine:

```bash
# Make script executable
chmod +x deploy-to-server.sh

# Run deployment
bash deploy-to-server.sh
```

Yeh script automatically:
- SSH se server connect karega
- Code pull/update karega
- Node.js/PM2 install karega (agar needed)
- Dependencies install karega
- Database setup karega
- Frontend build karega
- Services start karega

## Option 2: Manual Deployment (Server Par)

### Step 1: SSH to Server
```bash
ssh root@170.64.205.179
```

### Step 2: Run Setup Script
```bash
cd ~
git clone https://github.com/nurender/Siara.git siara-events
cd siara-events

# Run complete setup
chmod +x add-swap-and-setup.sh
bash add-swap-and-setup.sh
```

### Step 3: Verify
```bash
pm2 status
curl http://localhost:5000/api/health
curl -I http://localhost:3000
```

## Option 3: Step-by-Step Manual

```bash
# 1. SSH to server
ssh root@170.64.205.179

# 2. Install NVM (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 3. Install Node.js
nvm install 18
nvm use 18
nvm alias default 18

# 4. Install PM2
npm install -g pm2

# 5. Clone repository
cd ~
git clone https://github.com/nurender/Siara.git siara-events
cd siara-events

# 6. Create .env file
cat > .env <<EOF
DB_HOST=127.0.0.1
DB_USER=siara_user
DB_PASSWORD=siara_password_2024
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=siara_events_super_secret_jwt_key_2024_change_this_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://170.64.205.179:3000
NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
EOF

cp .env backend/.env

# 7. Setup MySQL user (needs sudo)
sudo bash create-mysql-user.sh

# 8. Install dependencies
npm install
cd backend && npm install && cd ..

# 9. Setup database
cd backend
node database/setup.js
cd ..

# 10. Build frontend
npm run build

# 11. Start with PM2
pm2 start ecosystem.config.js
pm2 save

# 12. Check status
pm2 status
```

## Troubleshooting

### If SSH connection fails:
- Check SSH key is set up
- Verify server IP is correct
- Check firewall settings

### If deployment fails:
- Check server logs
- Verify Node.js is installed
- Check MySQL is running
- Verify .env file is correct

### If frontend not accessible:
- Check firewall: `sudo ufw allow 3000/tcp`
- Check PM2 status: `pm2 status`
- Check logs: `pm2 logs siara-frontend`

## After Deployment

Access your site at:
- **Frontend:** http://170.64.205.179:3000
- **Backend:** http://170.64.205.179:5000
- **Manager:** http://170.64.205.179:3000/manager/login

Default admin credentials:
- Email: `admin@siara.com`
- Password: `admin123`

