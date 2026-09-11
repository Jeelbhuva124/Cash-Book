import http from 'http';

http.get('http://localhost:5001/api/admin/transactions', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
}).on('error', err => console.error('Request failed:', err));
