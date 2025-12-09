# 🗑️ Cleanup Old Scripts Guide

## Scripts to DELETE (Old/Redundant)

Yeh scripts ab redundant hain kyunki naye, better scripts available hain:

### Old Deployment Scripts
- `build-app.sh` ❌
- `check-build.sh` ❌
- `check-server.sh` ❌
- `final-deploy.sh` ❌
- `server-deploy.sh` ❌
- `update-and-build.sh` ❌

### Old Fix Scripts
- `complete-fix.sh` ❌ (use `complete-setup.sh` instead)
- `fix-backend-error.sh` ❌
- `fix-backend-server.sh` ❌
- `fix-backend.sh` ❌
- `fix-connection.sh` ❌
- `fix-database-connection.sh` ❌
- `fix-login-error.sh` ❌
- `fix-mysql-root.sh` ❌

### Old Install Scripts
- `install-mysql-now.sh` ❌
- `install-mysql.sh` ❌
- `install-node.sh` ❌
- `upgrade-node.sh` ❌

### Old Setup Scripts
- `setup-database.sh` ❌
- `setup-mysql-complete.sh` ❌

### Old Test Scripts
- `test-db-connection.sh` ❌
- `test-mysql-connection.sh` ❌

### Old Restart Scripts
- `rebuild-frontend.sh` ❌ (use `pm2 restart siara-frontend` instead)
- `restart-backend.sh` ❌ (use `pm2 restart siara-backend` instead)
- `restart-pm2.sh` ❌ (use `pm2 restart all` instead)

**Total: 25 files to delete**

---

## Scripts to KEEP

### Essential Scripts
- `create-mysql-user.sh` ✅ (Still needed for MySQL user setup)
- `sync-cms-to-server.sh` ✅ (Useful for CMS sync)

---

## New Scripts (in ~/siara-events/)

Use these instead of old scripts:

### Setup Scripts
- `add-swap-and-setup.sh` ✅ - Complete setup with swap (first time)
- `complete-setup.sh` ✅ - Complete setup without swap

### Fix Scripts
- `simple-fix.sh` ✅ - Quick fix for common issues
- `fix-site-not-running.sh` ✅ - Fix site not running
- `fix-node-killed.sh` ✅ - Fix Node.js killed issue
- `fix-pm2-and-mysql.sh` ✅ - Fix PM2 and MySQL

### Diagnostic Scripts
- `diagnose-node-issue.sh` ✅ - Diagnose Node.js issues
- `diagnose-server.sh` ✅ - Diagnose server issues

---

## How to Cleanup

### Option 1: Use Cleanup Script (Recommended)
```bash
cd ~
wget -O cleanup-old-scripts.sh https://raw.githubusercontent.com/nurender/Siara/main/cleanup-old-scripts.sh
chmod +x cleanup-old-scripts.sh
bash cleanup-old-scripts.sh
```

### Option 2: Manual Delete
```bash
cd ~

# Delete old scripts
rm -f build-app.sh check-build.sh check-server.sh complete-fix.sh
rm -f final-deploy.sh fix-backend-error.sh fix-backend-server.sh
rm -f fix-backend.sh fix-connection.sh fix-database-connection.sh
rm -f fix-login-error.sh fix-mysql-root.sh install-mysql-now.sh
rm -f install-mysql.sh install-node.sh rebuild-frontend.sh
rm -f restart-backend.sh restart-pm2.sh server-deploy.sh
rm -f setup-database.sh setup-mysql-complete.sh
rm -f test-db-connection.sh test-mysql-connection.sh
rm -f update-and-build.sh upgrade-node.sh

echo "✅ Cleanup complete!"
```

---

## After Cleanup

### Main Scripts to Use

1. **First Time Setup:**
   ```bash
   cd ~/siara-events
   bash add-swap-and-setup.sh
   ```

2. **Quick Fix:**
   ```bash
   cd ~/siara-events
   bash simple-fix.sh
   ```

3. **Site Not Running:**
   ```bash
   cd ~/siara-events
   bash fix-site-not-running.sh
   ```

4. **PM2 Commands (instead of restart scripts):**
   ```bash
   pm2 restart all          # Restart all
   pm2 restart siara-backend   # Restart backend
   pm2 restart siara-frontend  # Restart frontend
   pm2 logs                  # View logs
   pm2 status                # Check status
   ```

---

## Summary

- **Delete:** 25 old/redundant scripts
- **Keep:** 2 essential scripts (`create-mysql-user.sh`, `sync-cms-to-server.sh`)
- **Use:** New scripts in `~/siara-events/`

Cleanup ke baad, sab kuch organized aur maintainable hoga! 🎉

