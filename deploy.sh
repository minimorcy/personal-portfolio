#!/bin/bash
set -e

echo "Deploying portfolio..."

git pull origin main
npm ci --production=false
npm run build
pm2 reload ecosystem.config.js
pm2 save

echo "Deploy complete!"
