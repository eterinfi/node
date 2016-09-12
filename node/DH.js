// node.js: DH

const crypto = require('crypto');

// xiaoming's keys:
var ming = crypto.createDiffieHellman(512);
var ming_keys = ming.generateKeys(); // A=g^a mod p

var prime = ming.getPrime(); // p
var generator = ming.getGenerator(); // g

console.log('Prime: ' + prime.toString('hex'));
console.log('Generator: ' + generator.toString('hex'));

// xiaohong's keys:
var hong = crypto.createDiffieHellman(prime, generator);
var hong_keys = hong.generateKeys(); // B=g^b mod p

// exchange and generate secrets:
var ming_secret = ming.computeSecret(hong_keys); // s=B^a mod p
var hong_secret = hong.computeSecret(ming_keys); // s=A^b mod p

// print secrets:
console.log('Secret of Xiao Ming: ' + ming_secret.toString('hex'));
console.log('Secret of Xiao Hong: ' + hong_secret.toString('hex'));