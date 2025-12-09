# 🔧 Fix: CMS Pages Not Showing on Server

## Problem
Local par jo pages set kiye the, wo server par show nahi ho rahe.

## Solution

### Option 1: Run CMS Seed Script (Recommended)

```bash
cd ~/siara-events/backend
node database/seed-cms.js
```

### Option 2: Use Sync Script

```bash
# Script download
cd ~
wget -O sync-cms-to-server.sh https://raw.githubusercontent.com/nurender/Siara/main/sync-cms-to-server.sh
chmod +x sync-cms-to-server.sh

# Run
bash sync-cms-to-server.sh
```

### Option 3: Manual Steps

```bash
# 1. Run CMS seed
cd ~/siara-events/backend
node database/seed-cms.js

# 2. Verify pages
mysql -u siara_user -psiara_password_2024 siara_events -e "SELECT slug, title FROM cms_pages;"

# 3. Verify sections
mysql -u siara_user -psiara_password_2024 siara_events -e "SELECT page_id, COUNT(*) as sections FROM cms_sections GROUP BY page_id;"

# 4. Restart backend
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
pm2 restart siara-backend

# 5. Rebuild frontend
cd ~/siara-events
npm run build
pm2 restart siara-frontend
```

## Check Current Status

```bash
# Check pages
mysql -u siara_user -psiara_password_2024 siara_events -e "SELECT COUNT(*) as page_count FROM cms_pages;"

# Check sections
mysql -u siara_user -psiara_password_2024 siara_events -e "SELECT COUNT(*) as section_count FROM cms_sections;"

# Check pages with sections
mysql -u siara_user -psiara_password_2024 siara_events <<EOF
SELECT p.slug, p.title, COUNT(s.id) as section_count 
FROM cms_pages p 
LEFT JOIN cms_sections s ON p.id = s.page_id 
GROUP BY p.id, p.slug, p.title;
EOF
```

## Expected Pages

After running seed-cms.js, you should have:
- Home page (with hero, services, portfolio sections)
- About page
- Services page
- Portfolio page
- Blog page
- Contact page

## If Pages Still Don't Show

1. **Check Frontend Build:**
   ```bash
   cd ~/siara-events
   npm run build
   pm2 restart siara-frontend
   ```

2. **Check Backend API:**
   ```bash
   curl http://localhost:5000/api/cms/pages
   curl http://localhost:5000/api/cms/pages/home
   ```

3. **Check Frontend Logs:**
   ```bash
   pm2 logs siara-frontend --lines 50
   ```

4. **Check Browser Console:**
   - Open http://170.64.205.179:3000
   - Check browser console for errors
   - Check Network tab for API calls

## Verify

```bash
# Test API
curl http://localhost:5000/api/cms/pages

# Test specific page
curl http://localhost:5000/api/cms/pages/home

# Check frontend
curl http://localhost:3000
```

---

**Note:** `seed-cms.js` script creates all default pages and sections. Run it once to sync all CMS data to server.

