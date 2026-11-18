// A local stand-in for the Apps Script web app, for testing the Register page.
// Run: node registration/tests/mock-server.js  -> http://localhost:8078
const http = require('http');
const { makeGoogle } = require('./fake-google');
const { ctx, sheets } = makeGoogle();
ctx.setup();
sheets.Settings.data.find(r => r[0] === 'bKash number')[1] = '01700000000';
const key = sheets.Settings.data.find(r => r[0] === 'SMS key')[1];
console.log('SMS key', key);
http.createServer((req, res) => {
  const send = o => { res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(o)); };
  if (req.method === 'GET' && req.url.startsWith('/key')) return send({ key });
  if (req.method === 'GET' && req.url.startsWith('/sheets')) return send(sheets.Registrations.data);
  if (req.method === 'GET') return send(ctx.doGet());
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' }); return res.end(); }
  let body = ''; req.on('data', c => body += c); req.on('end', () => send(ctx.doPost({ postData: { contents: body }, parameter: {} })));
}).listen(8078);
