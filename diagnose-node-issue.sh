#!/bin/bash

echo "=========================================="
echo "  Diagnosing Node.js Issue"
echo "=========================================="
echo ""

echo "1. Checking system memory..."
free -h
echo ""

echo "2. Checking disk space..."
df -h ~
echo ""

echo "3. Checking NVM installation..."
if [ -d "$HOME/.nvm" ]; then
    echo "✅ NVM directory exists"
    ls -la ~/.nvm/versions/node/ 2>/dev/null | head -5 || echo "⚠️  No Node versions found"
else
    echo "❌ NVM not installed!"
    exit 1
fi

echo ""
echo "4. Checking NVM environment..."
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "✅ nvm.sh exists"
    . "$NVM_DIR/nvm.sh"
    echo "✅ NVM sourced"
else
    echo "❌ nvm.sh not found!"
    exit 1
fi

echo ""
echo "5. Checking Node installation..."
which node || echo "❌ Node not in PATH"
echo "NVM current: $(nvm current 2>&1)"
echo "NVM versions: $(nvm list 2>&1 | head -3)"

echo ""
echo "6. Testing Node directly..."
NODE_PATH=$(nvm which node 2>&1)
if [ -f "$NODE_PATH" ]; then
    echo "✅ Node binary found: $NODE_PATH"
    echo "Testing with full path..."
    "$NODE_PATH" -v 2>&1 || echo "❌ Node binary execution failed"
else
    echo "❌ Node binary not found!"
fi

echo ""
echo "7. Checking for OOM killer logs..."
dmesg | grep -i "killed process" | tail -5 || echo "No recent OOM kills found"

echo ""
echo "=========================================="
echo "Diagnosis Complete"
echo "=========================================="

