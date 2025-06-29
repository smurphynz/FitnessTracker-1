#!/usr/bin/env node

// Main entry point for production deployment
const { spawn, execSync } = require('child_process');
const { existsSync } = require('fs');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log('Starting Calisthenics Fitness Tracker');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Build if needed
if (!existsSync('./dist/index.js')) {
  console.log('Creating production build...');
  try {
    execSync('node production-build.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

// Start server
console.log('Starting server...');
const server = spawn('node', ['dist/index.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.kill('SIGINT');
});