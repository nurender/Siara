#!/bin/bash
# Restart PM2 processes
# Usage: bash restart-pm2.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd ~/siara-events

echo "🔄 Restarting PM2 processes..."
pm2 restart all

echo "📊 PM2 Status:"
pm2 status
