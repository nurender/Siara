# 🛠️ Server Setup Instructions

## Prerequisites Installation

SSH into server and run these commands:

```bash
ssh nurie@170.64.205.179
```

### 1. Install Node.js 18+

```bash
# Option A: Using NodeSource (Recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**OR using NVM (if you don't have sudo access):**

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
npm --version
```

### 2. Install PM2

```bash
npm install -g pm2
```

### 3. Install MySQL (if not installed)

```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### 4. Setup Database

```bash
mysql -u root -p
```

In MySQL prompt:
```sql
CREATE DATABASE siara_events;
CREATE USER 'siara_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON siara_events.* TO 'siara_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Deploy Application

After Node.js is installed, run:

```bash
cd ~/siara-events

# Setup environment variables
nano .env
```

Add:
```env
DB_HOST=localhost
DB_USER=siara_user
DB_PASSWORD=your_secure_password
DB_NAME=siara_events
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://170.64.205.179:3000
NEXT_PUBLIC_API_URL=http://170.64.205.179:5000
```

```bash
# Copy to backend
cp .env backend/.env

# Install dependencies
npm install
cd backend && npm install && cd ..

# Setup database
cd backend
node database/setup.js
node database/setup-cms.js
node database/seed.js
node database/seed-cms.js
cd ..

# Build
npm run build

# Start with PM2
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Follow the instructions shown
```

### 6. Verify

```bash
pm2 status
curl http://localhost:5000/api/health
```

---

## Quick Deploy After Setup

Once everything is set up, for future updates:

```bash
cd ~/siara-events
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

