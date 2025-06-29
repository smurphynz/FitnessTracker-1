#!/bin/bash

# Production deployment script for Calisthenics Fitness Tracker
# This script ensures the app runs in production mode regardless of .replit settings

echo "🚀 Starting Calisthenics Fitness Tracker - Production Mode"

# Set production environment variables
export NODE_ENV=production
export PORT=${PORT:-5000}

# Check if build exists, if not create it
if [ ! -f "dist/index.js" ]; then
    echo "📦 Building application for production..."
    
    # Build frontend
    echo "Building frontend..."
    npx vite build
    
    # Build backend
    echo "Building backend..."
    npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
    
    echo "✅ Build completed"
fi

# Start production server
echo "🏁 Starting production server on port $PORT"
node dist/index.js