# 🔧 Fix: MySQL Service Not Found

## Problem
`Unit mysql.service could not be found` - MySQL install nahi hai.

## Solution

### Option 1: MySQL Install Karein (Sudo Required)

```bash
# MySQL install
sudo apt update
sudo apt install mysql-server -y

# MySQL start
sudo systemctl start mysql
sudo systemctl enable mysql

# MySQL secure setup (optional)
sudo mysql_secure_installation
```

### Option 2: Check Alternative Names

MySQL ko different name se bhi install kiya ja sakta hai:

```bash
# Check all MySQL/MariaDB services
systemctl list-unit-files | grep -i mysql
systemctl list-unit-files | grep -i mariadb

# Try MariaDB (MySQL alternative)
sudo systemctl status mariadb
```

### Option 3: Direct MySQL Test (Install Ke Bina)

Agar MySQL client already hai:

```bash
# Direct connection test
mysql -u root -e "SELECT 1;"

# Agar yeh kaam kare, to MySQL running hai
# Service name different ho sakta hai
```

---

## Quick Check Script

```bash
chmod +x ~/install-mysql.sh
bash ~/install-mysql.sh
```

---

## Complete Installation

```bash
# 1. Update packages
sudo apt update

# 2. Install MySQL
sudo apt install mysql-server -y

# 3. Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 4. Check status
sudo systemctl status mysql

# 5. Test connection
mysql -u root -e "SELECT 1;"

# 6. Create database
mysql -u root -e "CREATE DATABASE siara_events;"

# 7. Setup database
cd ~/siara-events/backend
node database/setup.js
node database/setup-cms.js
```

---

## Without Sudo Access

Agar sudo password nahi hai:

1. **Server admin se contact karein** - MySQL install karne ke liye
2. **Ya check karein** - MySQL already installed ho sakta hai different name se:
   ```bash
   which mysql
   mysql --version
   ```

---

## Alternative: Use Existing Database

Agar MySQL already running hai but service name different hai:

```bash
# Find MySQL process
ps aux | grep mysql

# Find MySQL socket
find /var/run -name mysql.sock 2>/dev/null

# Direct connection
mysql -u root -e "SELECT 1;"
```

---

## Next Steps

1. **MySQL install karein** (agar nahi hai)
2. **Database create karein**
3. **Backend restart karein**

**Quick Command:**
```bash
sudo apt update && sudo apt install mysql-server -y && sudo systemctl start mysql
```

