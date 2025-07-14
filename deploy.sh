#!/bin/bash

cd /home/admin/frontend/farm || exit

echo "➡️ Pulling latest changes..."
git pull origin main

echo "🧹 Stopping old PM2 process..."
pm2 delete next-app

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building app..."
npm run build

echo "🚀 Starting app with PM2..."
pm2 start npm --name "next-app" -- start

echo "💾 Saving PM2 process list..."
pm2 save

echo "✅ Deployment complete!"
