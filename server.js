// Production server entry point for Replit deployment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log('Starting Calisthenics Fitness Tracker - Production Mode');

// Use dynamic import for ES modules
import('./server/index.ts').catch(() => {
  // Fallback to tsx if direct import fails
  const { spawn } = require('child_process');
  const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
});