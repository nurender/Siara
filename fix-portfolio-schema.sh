#!/bin/bash

echo "=========================================="
echo "  Fix Portfolio Table Schema"
echo "=========================================="
echo ""

cd ~/siara-events/backend

echo "1. Adding missing columns to portfolio table..."

# Get database credentials from .env
source .env 2>/dev/null || true

DB_HOST=${DB_HOST:-127.0.0.1}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_NAME=${DB_NAME:-siara_events}

mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME" <<EOF
-- Add missing columns if they don't exist
ALTER TABLE portfolio 
  ADD COLUMN IF NOT EXISTS subtitle VARCHAR(255) AFTER title,
  ADD COLUMN IF NOT EXISTS summary TEXT AFTER description,
  ADD COLUMN IF NOT EXISTS venue VARCHAR(255) AFTER location,
  ADD COLUMN IF NOT EXISTS status ENUM('draft', 'published', 'archived') DEFAULT 'published' AFTER is_active;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Portfolio table updated"
else
    echo "⚠️  Trying alternative method (MySQL 8.0+ doesn't support IF NOT EXISTS in ALTER TABLE)..."
    
    # Alternative: Check and add columns one by one
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME" <<'SQL'
-- Check and add subtitle
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'subtitle';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE portfolio ADD COLUMN subtitle VARCHAR(255) AFTER title', 'SELECT "subtitle exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add summary
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'summary';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE portfolio ADD COLUMN summary TEXT AFTER description', 'SELECT "summary exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add venue
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'venue';
SET @sql = IF(@col_exists = 0, 'ALTER TABLE portfolio ADD COLUMN venue VARCHAR(255) AFTER location', 'SELECT "venue exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add status
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'status';
SET @sql = IF(@col_exists = 0, "ALTER TABLE portfolio ADD COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'published' AFTER is_active", 'SELECT "status exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SQL

    if [ $? -eq 0 ]; then
        echo "✅ Portfolio table updated"
    else
        echo "❌ Failed to update portfolio table"
        exit 1
    fi
fi

echo ""
echo "2. Verifying portfolio table structure..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME" -e "DESCRIBE portfolio;" 2>&1 | grep -E "subtitle|summary|venue|status" || echo "   (Columns check)"

echo ""
echo "3. Running seed script..."
node database/seed-cms.js 2>&1 | tail -20

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""

