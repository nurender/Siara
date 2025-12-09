# 🔧 Fix: Login 500 Internal Server Error

## Problem
Login API returning `500 Internal Server Error` with message "Server error during login"

## Possible Causes

1. **Database connection issue** - Backend can't connect to MySQL
2. **Missing JWT_EXPIRES_IN** - JWT token expiration not set
3. **Database query error** - Users table query failing
4. **Backend not running properly**

## Quick Fix

### Step 1: Check Backend Logs

```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 logs siara-backend --lines 50
```

### Step 2: Check Database Connection

```bash
# Test MySQL connection
mysql -u siara_user -psiara_password_2024 -e "USE siara_events; SELECT COUNT(*) FROM users;"

# Check if admin user exists
mysql -u siara_user -psiara_password_2024 -e "USE siara_events; SELECT email, role FROM users;"
```

### Step 3: Add JWT_EXPIRES_IN to .env

```bash
cd ~/siara-events/backend
nano .env
```

Add this line:
```
JWT_EXPIRES_IN=7d
```

### Step 4: Restart Backend

```bash
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 restart siara-backend

# Check status
pm2 status
curl http://localhost:5000/api/health
```

### Step 5: Create Admin User (If Missing)

```bash
cd ~/siara-events/backend
node database/seed.js
```

Or manually:
```bash
mysql -u siara_user -psiara_password_2024 siara_events <<EOF
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@siara.com', '\$2a\$10\$YourHashedPasswordHere', 'admin');
EOF
```

## Use Fix Script

```bash
# Download and run fix script
cd ~
wget -O fix-login-error.sh https://raw.githubusercontent.com/nurender/Siara/main/fix-login-error.sh
chmod +x fix-login-error.sh
bash fix-login-error.sh
```

## Verify

```bash
# Test login API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@siara.com","password":"admin123"}'

# Should return:
# {"success":true,"message":"Login successful","data":{...}}
```

## Common Issues

### Issue 1: JWT_EXPIRES_IN Missing
**Error:** `JWT_EXPIRES_IN is not defined`
**Fix:** Add `JWT_EXPIRES_IN=7d` to `.env`

### Issue 2: Database Connection Failed
**Error:** `Database connection failed`
**Fix:** Check `.env` file has correct `DB_USER` and `DB_PASSWORD`

### Issue 3: Users Table Empty
**Error:** No users found
**Fix:** Run `node database/seed.js`

### Issue 4: Backend Not Running
**Error:** Connection refused
**Fix:** `pm2 restart siara-backend`

---

**Default Admin Credentials:**
- Email: `admin@siara.com`
- Password: `admin123`

