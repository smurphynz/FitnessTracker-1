#!/bin/bash

# Ultimate production deployment script for Replit
# This script can be used as the run command to bypass dev restrictions

echo "🚀 Calisthenics Fitness Tracker - Production Deployment"

# Set production environment
export NODE_ENV=production
export PORT=${PORT:-5000}

# Ensure build exists or create it
if [ ! -f "dist/index.js" ] || [ ! -d "dist/public" ]; then
    echo "📦 Creating production build..."
    node production-build.js
fi

# Start production server
echo "🏁 Starting on port $PORT"
exec node start.js