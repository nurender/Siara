# 🚀 Quick Deployment Reference

## For New Server (First Time)

1. **Read:** `DEPLOY.md` - Complete step-by-step guide
2. **Follow:** All 10 steps in DEPLOY.md

## For Updates (After Code Changes)

```bash
ssh your-user@your-server-ip
cd ~/siara-events
bash update-and-build.sh
pm2 restart all
```

## Important Files

- **`DEPLOY.md`** - Complete deployment guide (READ THIS FIRST)
- **`ecosystem.config.js`** - PM2 configuration
- **`update-and-build.sh`** - Update script
- **`restart-pm2.sh`** - Restart PM2 script
- **`final-deploy.sh`** - First time deployment script

## Quick Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart
pm2 restart all
```

**For detailed instructions, see `DEPLOY.md`**

