#!/usr/bin/env node

/**
 * Production startup script for Calisthenics Fitness Tracker
 * This script handles the production build and server startup
 */

import { spawn, execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

// Set production environment
process.env.NODE_ENV = 'production';

console.log('Starting Calisthenics Fitness Tracker in production mode...');

function buildApplication() {
  console.log('Building frontend...');
  
  try {
    // Create dist directory if it doesn't exist
    if (!existsSync('./dist')) {
      mkdirSync('./dist', { recursive: true });
    }
    
    // Build frontend with vite
    execSync('npx vite build', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('Frontend build completed');
    
    // Build backend with esbuild
    console.log('Building backend...');
    execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('Backend build completed');
    return true;
    
  } catch (error) {
    console.error('Build failed:', error.message);
    return false;
  }
}

function startServer() {
  if (!existsSync('./dist/index.js')) {
    console.error('Server build not found. Please run build first.');
    return false;
  }
  
  console.log('Starting production server...');
  
  // Start the production server
  const server = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: process.env.PORT || '5000'
    }
  });
  
  server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
  
  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code);
  });
  
  return true;
}

// Main execution
async function main() {
  // Check if we should build or just start
  const shouldBuild = !existsSync('./dist/index.js') || process.argv.includes('--build');
  
  if (shouldBuild) {
    const buildSuccess = buildApplication();
    if (!buildSuccess) {
      process.exit(1);
    }
  }
  
  startServer();
}

main().catch((error) => {
  console.error('Startup failed:', error);
  process.exit(1);
});