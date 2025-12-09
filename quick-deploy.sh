#!/bin/bash

# Quick Deployment Script for Siara Events
# Run this on the server after uploading code

echo "🚀 Quick Deployment Starting..."

# Create logs directory
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install && cd ..

# Build Next.js
echo "🔨 Building Next.js..."
npm run build

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment Complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs"

