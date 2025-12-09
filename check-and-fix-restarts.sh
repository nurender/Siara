#!/bin/bash

echo "=========================================="
echo "  Check & Fix PM2 Restart Issues"
echo "=========================================="
echo ""

cd ~/siara-events

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "1. Checking PM2 Status..."
pm2 status

echo ""
echo "2. Checking Backend Logs (Last 30 lines)..."
pm2 logs siara-backend --lines 30 --nostream

echo ""
echo "3. Checking Frontend Logs (Last 30 lines)..."
pm2 logs siara-frontend --lines 30 --nostream

echo ""
echo "4. Checking if processes are crashing..."
RESTARTS=$(pm2 jlist | grep -o '"restart_time":[0-9]*' | head -1 | cut -d: -f2)
if [ "$RESTARTS" -gt 5 ]; then
    echo "⚠️  High restart count detected: $RESTARTS"
    echo "   This indicates the process is crashing"
fi

echo ""
echo "5. Testing Backend Connection..."
curl -s http://localhost:5000/api/health || echo "❌ Backend not responding"

echo ""
echo "6. Checking Ports..."
netstat -tulpn 2>/dev/null | grep -E '3000|5000' || ss -tulpn 2>/dev/null | grep -E '3000|5000'

echo ""
echo "=========================================="
echo "Diagnosis Complete"
echo "=========================================="
echo ""
echo "Common Issues:"
echo "  1. Database connection error - Check backend/.env"
echo "  2. Missing dependencies - Run: npm install (in both root and backend)"
echo "  3. Port already in use - Check with: netstat -tulpn | grep -E '3000|5000'"
echo "  4. Missing environment variables - Check .env files"
echo ""

