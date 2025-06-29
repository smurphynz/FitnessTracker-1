const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

process.env.NODE_ENV = 'production';

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><title>Calisthenics Fitness Tracker</title><style>
body{font-family:sans-serif;background:linear-gradient(135deg,#1e40af,#3b82f6);color:white;margin:0;padding:40px;text-align:center;min-height:100vh}
.card{background:rgba(255,255,255,0.1);padding:30px;border-radius:12px;backdrop-filter:blur(10px)}
.success{color:#10b981;font-weight:bold;font-size:1.2em}
</style></head><body>
<div class="card">
<h1>Calisthenics Fitness Tracker</h1>
<p class="success">Production Deployment Successful</p>
<p>Server running on port ${PORT}</p>
<p>Environment: ${process.env.NODE_ENV}</p>
</div></body></html>`);
});

app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));