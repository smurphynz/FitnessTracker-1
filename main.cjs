const express = require('express');

process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || 5000;

console.log('Starting production server...');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Calisthenics Fitness Tracker</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white; 
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            background: rgba(255,255,255,0.1); 
            padding: 40px; 
            border-radius: 15px; 
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        h1 { margin-top: 0; font-size: 2.5em; }
        .status { margin: 20px 0; }
        .success { color: #10b981; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Calisthenics Fitness Tracker</h1>
        <div class="status">
            <p class="success">Deployment Successful!</p>
            <p>Environment: ${process.env.NODE_ENV}</p>
            <p>Server running on port ${PORT}</p>
        </div>
        <p>Your fitness tracking application is now live.</p>
    </div>
</body>
</html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', port: PORT });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server running on port ${PORT}`);
});