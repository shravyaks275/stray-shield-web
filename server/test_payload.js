const http = require('http');

const data = JSON.stringify({
  imageBuffer: 'A'.repeat(2 * 1024 * 1024) // 2MB string
});

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/classify',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', console.error);
req.write(data);
req.end();
