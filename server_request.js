const nock = require('nock');

nock('http://localhost:8000', {
  reqheaders: {
    'authorization': '',
    'content-type': 'application/json'
  }
})
.get('/protected/resource')
.reply(200, 'Authenticated content');
