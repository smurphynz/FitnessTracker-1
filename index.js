import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;

console.log('Calisthenics Fitness Tracker - Production Server Starting');

app.use(express.json());
app.use(express.static('dist/public'));

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
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; font-weight: 700; }
        .success { color: #10b981; font-weight: 600; font-size: 1.2rem; margin-bottom: 1rem; }
        .info { font-size: 1rem; opacity: 0.9; margin: 0.5rem 0; }
        .button {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 1rem;
            transition: background 0.2s;
        }
        .button:hover { background: #059669; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Calisthenics Fitness Tracker</h1>
        <p class="success">✓ Deployment Successful</p>
        <p class="info">Production server running on port ${PORT}</p>
        <p class="info">Environment: ${process.env.NODE_ENV || 'production'}</p>
        <p class="info">Ready for fitness tracking</p>
    </div>
</body>
</html>`);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    port: PORT, 
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
});