# Deployment Guide - Siara Events

## Server Requirements

- Node.js 18+ 
- MySQL 8.0+
- PM2 (Process Manager)
- Nginx (Reverse Proxy - Optional but recommended)

## Step 1: Connect to Server

```bash
ssh nurie@170.64.205.179
```

## Step 2: Install Required Software

### Install Node.js (if not installed)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2
```bash
sudo npm install -g pm2
```

### Install MySQL (if not installed)
```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Install Nginx (Optional - for reverse proxy)
```bash
sudo apt install nginx -y
```

## Step 3: Clone/Upload Project

### Option A: Using Git
```bash
cd ~
git clone <your-repo-url> siara-events
cd siara-events
```

### Option B: Upload via SCP
From your local machine:
```bash
scp -r . nurie@170.64.205.179:~/siara-events
```

## Step 4: Setup Environment Variables

Create `.env` file in project root:
```bash
cd ~/siara-events
nano .env
```

Add the following:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=siara_events

# Backend Configuration
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://your-domain.com

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Create `.env` file in backend folder:
```bash
cd ~/siara-events/backend
nano .env
```

Add the same database and backend configuration.

## Step 5: Setup Database

```bash
cd ~/siara-events/backend

# Create database
mysql -u root -p
CREATE DATABASE siara_events;
EXIT;

# Run database setup
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js
```

## Step 6: Install Dependencies

```bash
cd ~/siara-events

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 7: Build Application

```bash
cd ~/siara-events
npm run build
```

## Step 8: Setup PM2

```bash
cd ~/siara-events

# Make deploy script executable
chmod +x deploy.sh

# Start applications with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions shown
```

## Step 9: Setup Nginx (Reverse Proxy)

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/siara-events
```

Add the following:
```nginx
# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/siara-events /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 10: Setup SSL (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Useful Commands

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs siara-backend
pm2 logs siara-frontend

# Restart
pm2 restart siara-backend
pm2 restart siara-frontend

# Stop
pm2 stop siara-backend
pm2 stop siara-frontend

# Delete
pm2 delete siara-backend
pm2 delete siara-frontend
```

### Deployment
```bash
cd ~/siara-events
./deploy.sh
```

### View Logs
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Troubleshooting

### Check if ports are in use
```bash
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :5000
```

### Check PM2 processes
```bash
pm2 list
pm2 monit
```

### Restart services
```bash
sudo systemctl restart nginx
pm2 restart all
```

### Check database connection
```bash
cd ~/siara-events/backend
node -e "require('./config/db').testConnection()"
```

## Firewall Configuration

If using UFW:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

