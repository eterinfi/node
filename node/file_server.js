'use strict';
var
      fs = require('fs'),
     url = require('url'),
    path = require('path'),
    http = require('http');

// Get root dir from command line parameters, default is current dir:
var root = path.resolve(process.argv[2] || '.');
console.log('Static root dir: ' + root);

// Create server:
var server = http.createServer(function (request, response) {
    // Get URL's path, such as '/css/bootstrap.css':
    var pathname = url.parse(request.url).pathname;
    // Get corresponding local file path, such as '/srv/www/css/bootstrap.css':
    var filepath = path.join(root, pathname);
    // Get file status:
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // No error and the file exists:
            console.log('200 ' + request.url);
            // Send response status 200:
            response.writeHead(200);
            // Direct file stream to response:
            fs.createReadStream(filepath).pipe(response);
        } else {
            // Error or file does not exist:
            console.log('404 ' + request.url);
            // Send response status 404:
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});

server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');