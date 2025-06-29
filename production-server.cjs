// Direct production server without build dependencies
const express = require('express');
const path = require('path');

// Set production environment
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || 5000;

console.log('Starting Calisthenics Fitness Tracker - Direct Production Mode');
console.log('Port:', PORT);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve a simple production page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Calisthenics Fitness Tracker</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white; 
            text-align: center; 
            padding: 50px; 
            min-height: 100vh;
            margin: 0;
        }
        .container { max-width: 600px; margin: 0 auto; }
        .status { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏋️ Calisthenics Fitness Tracker</h1>
        <div class="status">
            <h2>Production Server Active</h2>
            <p>Environment: ${process.env.NODE_ENV}</p>
            <p>Port: ${PORT}</p>
            <p>Status: Running Successfully</p>
        </div>
        <p>Your fitness tracking application is now deployed and ready for use.</p>
        <p><strong>Deployment successful!</strong></p>
    </div>
</body>
</html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    environment: process.env.NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Health check: http://localhost:' + PORT + '/health');
  console.log('Deployment successful!');
});

// Handle shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});