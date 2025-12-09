#!/bin/bash

echo "=========================================="
echo "  Fix Node.js Killed Issue"
echo "=========================================="
echo ""

cd ~

echo "1. Checking system resources..."
free -h
echo ""
df -h ~ | tail -1
echo ""

echo "2. Checking NVM..."
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
    echo "❌ NVM not installed!"
    echo "Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
fi

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "✅ NVM loaded"
echo "   Current version: $(nvm current 2>&1)"

echo ""
echo "3. Checking Node installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node not found! Installing Node 18..."
    nvm install 18
    nvm use 18
    nvm alias default 18
fi

echo ""
echo "4. Testing Node with full path..."
NODE_PATH=$(which node 2>&1)
if [ -n "$NODE_PATH" ] && [ -f "$NODE_PATH" ]; then
    echo "   Node path: $NODE_PATH"
    echo "   Testing..."
    timeout 2 "$NODE_PATH" -v 2>&1 || echo "   ⚠️  Node execution timed out or failed"
else
    echo "   ❌ Node binary not found!"
    echo "   Reinstalling Node..."
    nvm uninstall 18 2>/dev/null
    nvm install 18
    nvm use 18
    nvm alias default 18
fi

echo ""
echo "5. Setting up environment..."
# Add to .bashrc if not present
if ! grep -q "NVM_DIR" ~/.bashrc 2>/dev/null; then
    echo "" >> ~/.bashrc
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"' >> ~/.bashrc
    echo "✅ Added NVM to .bashrc"
fi

# Add to .profile if not present
if ! grep -q "NVM_DIR" ~/.profile 2>/dev/null; then
    echo "" >> ~/.profile
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.profile
    echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.profile
    echo "✅ Added NVM to .profile"
fi

echo ""
echo "6. Final test..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "   Node version: $(node -v 2>&1)"
echo "   NPM version: $(npm -v 2>&1)"
echo "   Node path: $(which node)"

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "If Node still gets killed, check:"
echo "  1. Memory: free -h"
echo "  2. Disk space: df -h"
echo "  3. OOM logs: dmesg | grep -i killed"
echo ""

