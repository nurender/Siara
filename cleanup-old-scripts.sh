#!/bin/bash

echo "=========================================="
echo "  Cleanup Old Scripts"
echo "=========================================="
echo ""

cd ~

# Scripts to DELETE (old/redundant)
OLD_SCRIPTS=(
    "build-app.sh"
    "check-build.sh"
    "check-server.sh"
    "complete-fix.sh"
    "final-deploy.sh"
    "fix-backend-error.sh"
    "fix-backend-server.sh"
    "fix-backend.sh"
    "fix-connection.sh"
    "fix-database-connection.sh"
    "fix-login-error.sh"
    "fix-mysql-root.sh"
    "install-mysql-now.sh"
    "install-mysql.sh"
    "install-node.sh"
    "rebuild-frontend.sh"
    "restart-backend.sh"
    "restart-pm2.sh"
    "server-deploy.sh"
    "setup-database.sh"
    "setup-mysql-complete.sh"
    "test-db-connection.sh"
    "test-mysql-connection.sh"
    "update-and-build.sh"
    "upgrade-node.sh"
)

# Scripts to KEEP (still useful)
KEEP_SCRIPTS=(
    "create-mysql-user.sh"      # Still needed for MySQL user setup
    "sync-cms-to-server.sh"     # Useful for CMS sync
)

echo "Scripts to DELETE (old/redundant):"
echo "=================================="
for script in "${OLD_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo "  ❌ $script"
    fi
done

echo ""
echo "Scripts to KEEP:"
echo "==============="
for script in "${KEEP_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo "  ✅ $script"
    fi
done

echo ""
echo "New scripts in siara-events (use these instead):"
echo "================================================"
if [ -d "siara-events" ]; then
    cd siara-events
    NEW_SCRIPTS=(
        "add-swap-and-setup.sh"      # Complete setup with swap
        "complete-setup.sh"          # Complete setup
        "simple-fix.sh"              # Simple fix
        "fix-site-not-running.sh"    # Site fix
        "fix-node-killed.sh"        # Node fix
        "fix-pm2-and-mysql.sh"       # PM2 & MySQL fix
        "diagnose-node-issue.sh"     # Node diagnostic
        "diagnose-server.sh"         # Server diagnostic
    )
    
    for script in "${NEW_SCRIPTS[@]}"; do
        if [ -f "$script" ]; then
            echo "  ✅ $script"
        fi
    fi
    cd ..
fi

echo ""
read -p "Delete old scripts? (y/n): " confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    echo ""
    echo "Deleting old scripts..."
    deleted=0
    for script in "${OLD_SCRIPTS[@]}"; do
        if [ -f "$script" ]; then
            rm -f "$script"
            echo "  ✅ Deleted: $script"
            ((deleted++))
        fi
    done
    echo ""
    echo "=========================================="
    echo "✅ Cleanup complete! Deleted $deleted files"
    echo "=========================================="
    echo ""
    echo "Useful scripts are now in ~/siara-events/"
    echo "Main scripts to use:"
    echo "  - add-swap-and-setup.sh (first time setup)"
    echo "  - simple-fix.sh (quick fix)"
    echo "  - fix-site-not-running.sh (site issues)"
else
    echo ""
    echo "Cleanup cancelled."
fi

