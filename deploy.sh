#!/bin/bash

echo "🚀 Starting deployment..."

# Exit immediately if any command fails
set -e

echo "🔄 Pulling latest changes from Git..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

# If using a build step like React, Next.js, etc.
# echo "🔨 Building app..."
# npm run build

echo "♻️ Restarting app with PM2..."
pm2 restart next-app --update-env

echo "✅ Deployment complete!"

