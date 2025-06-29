// CommonJS production entry point for Replit deployment
const { spawn } = require('child_process');

process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log('Starting Calisthenics Fitness Tracker');
console.log('Environment: production');
console.log('Port:', process.env.PORT);

const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

server.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

server.on('close', (code) => {
  process.exit(code || 0);
});

process.on('SIGTERM', () => server.kill('SIGTERM'));
process.on('SIGINT', () => server.kill('SIGINT'));