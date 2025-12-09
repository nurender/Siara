#!/bin/bash
# Install Node.js via NVM (no sudo required)

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" || {
  echo "Installing NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
}

echo "Installing Node.js 18..."
nvm install 18
nvm use 18
nvm alias default 18

echo "Installing PM2..."
npm install -g pm2

echo "✅ Node.js and PM2 installed!"
node --version
npm --version
pm2 --version

