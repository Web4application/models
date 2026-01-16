const nock = require('nock');
const axios = require('axios');

// -----------------------------
// Mock HTTPS server
// -----------------------------
const httpsBase = `https://localhost:8443`;

// Allow self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Mock GET /index.html
nock(httpsBase)
.get('/index.html')
.reply(200, '<h1>Mocked index.html</h1>');

// Mock GET /index.js
nock(httpsBase)
.get('/index.js')
.reply(200, '// Mocked index.js content');

// Mock GET /index.php
nock(httpsBase)
.get('/index.php')
.reply(200, '<?php echo "Mocked PHP"; ?>');

// Mock GET /phpmyadmin
nock(httpsBase)
.get('/phpmyadmin')
.reply(200, '<h1>Mocked phpMyAdmin</h1>');

// -----------------------------
// Test the mocked endpoints
// -----------------------------
async function testMocks() {
  try {
    const indexHtml = await axios.get(`${httpsBase}/index.html`);
    console.log('GET /index.html ->', indexHtml.data);

    const indexJs = await axios.get(`${httpsBase}/index.js`);
    console.log('GET /index.js ->', indexJs.data);

    const indexPhp = await axios.get(`${httpsBase}/index.php`);
    console.log('GET /index.php ->', indexPhp.data);

    const phpMyAdmin = await axios.get(`${httpsBase}/phpmyadmin`);
    console.log('GET /phpmyadmin ->', phpMyAdmin.data);

  } catch (err) {
    console.error(err);
  }
}

testMocks();
