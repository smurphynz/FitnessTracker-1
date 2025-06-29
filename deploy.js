#!/usr/bin/env node

// Production deployment script for Replit
import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Starting production deployment...');

// Set production environment
process.env.NODE_ENV = 'production';

try {
  // Build the application
  console.log('📦 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if build was successful
  if (!existsSync('./dist')) {
    throw new Error('Build failed - dist directory not found');
  }
  
  console.log('✅ Build completed successfully');
  
  // Start the production server
  console.log('🏁 Starting production server...');
  execSync('npm start', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}