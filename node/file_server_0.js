'use strict';
var
      fs = require('fs'),
     url = require('url'),
    path = require('path'),
    http = require('http');

// Get root dir from command line parameters, default is current dir:
var root = path.resolve(process.argv[2] || '.');
console.log('Static root dir: ' + root);


var server = http.createServer(function (request, response) {    // Create server
    var pathname = url.parse(request.url).pathname;              // Get URL's path, such as '/css/bootstrap.css'
    var filepath = path.join(root, pathname);                    // Get corresponding local file path, such as '/srv/www/css/bootstrap.css'
    fs.stat(filepath, function (err, stats) {                    // Get file status
        if (!err && stats.isFile()) {                            // No error and the file exists
            console.log('200 ' + request.url);
            response.writeHead(200);                             // Send response status 200
            fs.createReadStream(filepath).pipe(response);        // Direct file stream to response
        }
        else if (!err && stats.isDirectory()) {                 // No error and default
            var filepath1 = path.join(filepath, 'index.html');   // Try to search index.html as default
            fs.stat(filepath1, function (err1, stats1) {           // Get file status: index.html as default
                if (!err1 && stats1.isFile()) {
                    console.log('200 ' + request.url);
                    response.writeHead(200);
                    fs.createReadStream(filepath1).pipe(response);
                }
                else {
                    var filepath2 = path.join(filepath, 'default.html'); // Try to search default.html as default
                    fs.stat(filepath2, function(err2, stats2) {            // Get file status: default.html as default
                        if (!err2 && stats2.isFile()) {
                            console.log('200 ' + request.url);
                            response.writeHead(200);
                            fs.createReadStream(filepath2).pipe(response);
                        }
                        else {
                            console.log('404 ' + request.url);
                            response.writeHead(404);
                            response.end('404 Not Found');

                        }
                    });
                }
            });
        } 
        else {                                                   // Error or file does not exist
            console.log('404 ' + request.url);
            response.writeHead(404);                             // Send response status 404
            response.end('404 Not Found');
        }
    });
});

server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');