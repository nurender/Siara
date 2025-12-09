#!/bin/bash

echo "=========================================="
echo "  Siara Server Diagnostic Check"
echo "=========================================="
echo ""

echo "1. Checking PM2 Processes..."
ssh nurie@170.64.205.179 'bash -c "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\" && cd ~/siara-events && pm2 status"'

echo ""
echo "2. Checking Backend Logs (Last 10 lines)..."
ssh nurie@170.64.205.179 'bash -c "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\" && cd ~/siara-events && pm2 logs siara-backend --lines 10 --nostream"'

echo ""
echo "3. Checking Frontend Logs (Last 10 lines)..."
ssh nurie@170.64.205.179 'bash -c "export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\" && cd ~/siara-events && pm2 logs siara-frontend --lines 10 --nostream"'

echo ""
echo "4. Testing Backend API..."
ssh nurie@170.64.205.179 'curl -s http://localhost:5000/api/health || echo "❌ Backend not responding"'

echo ""
echo "5. Testing Frontend..."
ssh nurie@170.64.205.179 'curl -s -I http://localhost:3000 | head -1 || echo "❌ Frontend not responding"'

echo ""
echo "6. Checking MySQL Status..."
ssh nurie@170.64.205.179 'sudo systemctl status mysql --no-pager 2>/dev/null | head -3 || echo "MySQL check failed"'

echo ""
echo "=========================================="
echo "Diagnostic Complete"
echo "=========================================="

