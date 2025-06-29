#!/usr/bin/env node

// Simplified production entry point that works directly with the source
import { spawn } from 'child_process';

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log('Starting Calisthenics Fitness Tracker');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Run server directly from source with tsx
console.log('Starting production server...');
const server = spawn('npx', ['tsx', 'server/index.ts'], {
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