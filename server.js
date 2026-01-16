const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();

// ---------------------
// Configuration
// ---------------------
const HTTP_PORT = 8000;
const HTTPS_PORT = 8443;

// Load SSL certificates
const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs/cert.pem')),
};

// ---------------------
// Live reload server
// ---------------------
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

// Inject livereload script into served pages
app.use(connectLivereload());

// ---------------------
// Redirect HTTP -> HTTPS
// ---------------------
const redirectApp = express();
redirectApp.use((req, res) => {
  const host = req.headers.host.replace(/:\d+$/, `:${HTTPS_PORT}`);
  res.redirect(`https://${host}${req.url}`);
});
http.createServer(redirectApp).listen(HTTP_PORT, () => {
  console.log(`HTTP -> HTTPS redirect running on http://localhost:${HTTP_PORT}`);
});

// ---------------------
// Serve static files
// ---------------------
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------
// Routes
// ---------------------
app.get('/', (req, res) => {
  res.send('<h1>Welcome to your secure local dev server with live reload</h1><p>Try /index.html, /index.js, /index.php, /phpmyadmin</p>');
});
app.get('/index.html', (req, res) => res.send('<h1>Index HTML Page</h1>'));
app.get('/index.js', (req, res) => {
  res.type('.js');
  res.send('// Dummy JS\nconsole.log("Hello from index.js");');
});
app.get('/index.php', (req, res) => {
  res.type('.php');
  res.send('<?php echo "Hello from index.php"; ?>');
});
app.get('/phpmyadmin', (req, res) => res.send('<h1>phpMyAdmin placeholder</h1>'));

// ---------------------
// Start HTTPS server
// ---------------------
https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server running at https://localhost:${HTTPS_PORT}/`);
});
