// node.js: Hash & Hmac

const crypto = require('crypto');

const hash = crypto.createHash('md5');
hash.update('Hello, world!');
hash.update('Hello, nodejs!');
console.log('Hash in MD5: ' + hash.digest('hex'));

const hmac = crypto.createHmac('sha256', 'secret-key');
hmac.update('Hello, world!');
hmac.update('Hello, nodejs!');
console.log('Hmac in SHA256: ' + hmac.digest('hex'));