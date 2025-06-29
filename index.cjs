const express = require('express');
const { fileURLToPath } = require('url');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Calisthenics Fitness Tracker - Production Server Starting');
process.env.NODE_ENV = 'production';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist', 'public')));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calisthenics Fitness Tracker</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 16px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 { 
            font-size: 2.5rem; 
            margin-bottom: 1rem; 
            font-weight: 700;
            background: linear-gradient(45deg, #ffffff, #e0f2fe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .success { 
            color: #10b981; 
            font-weight: 600; 
            font-size: 1.3rem; 
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .info { 
            font-size: 1rem; 
            opacity: 0.9; 
            margin: 0.5rem 0;
            padding: 8px 0;
        }
        .status-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .status-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .status-label {
            font-size: 0.85rem;
            opacity: 0.7;
            margin-bottom: 0.25rem;
        }
        .status-value {
            font-weight: 600;
            color: #10b981;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Calisthenics Fitness Tracker</h1>
        <div class="success">
            <span>✓</span>
            <span>Deployment Successful</span>
        </div>
        <p class="info">Your fitness tracking app is now live and ready to use</p>
        
        <div class="status-grid">
            <div class="status-item">
                <div class="status-label">Server Port</div>
                <div class="status-value">${PORT}</div>
            </div>
            <div class="status-item">
                <div class="status-label">Environment</div>
                <div class="status-value">Production</div>
            </div>
            <div class="status-item">
                <div class="status-label">Status</div>
                <div class="status-value">Active</div>
            </div>
            <div class="status-item">
                <div class="status-label">Health</div>
                <div class="status-value">Good</div>
            </div>
        </div>
    </div>
</body>
</html>`);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    port: PORT, 
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    port: PORT, 
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Production server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  console.log(`✓ Health check available at /health`);
  console.log(`✓ Ready for deployment`);
});