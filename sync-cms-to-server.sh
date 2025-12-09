#!/bin/bash
# Sync CMS pages and sections to server

echo "🔄 Syncing CMS Data to Server"
echo "=============================="
echo ""

cd ~/siara-events/backend

echo "1️⃣ Running CMS seed script..."
if [ -f database/seed-cms.js ]; then
    node database/seed-cms.js
    echo "✅ CMS seed completed"
else
    echo "❌ seed-cms.js not found"
    exit 1
fi

echo ""
echo "2️⃣ Verifying CMS data..."
mysql -u siara_user -psiara_password_2024 siara_events <<EOF
SELECT 'Pages:' as info;
SELECT slug, title FROM cms_pages;

SELECT 'Sections per page:' as info;
SELECT p.slug, COUNT(s.id) as section_count 
FROM cms_pages p 
LEFT JOIN cms_sections s ON p.id = s.page_id 
GROUP BY p.id, p.slug;
EOF

echo ""
echo "3️⃣ Restarting backend..."
cd ~/siara-events
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 restart siara-backend
sleep 3

echo ""
echo "4️⃣ Rebuilding frontend..."
cd ~/siara-events
npm run build

echo ""
echo "5️⃣ Restarting frontend..."
pm2 restart siara-frontend

echo ""
echo "============================="
echo "✅ CMS Data Synced!"
echo ""
echo "Check:"
echo "  - Pages: http://170.64.205.179:3000"
echo "  - Admin: http://170.64.205.179:3000/manager/cms/pages"

