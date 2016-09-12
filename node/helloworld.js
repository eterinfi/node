'use strict'

// Import http module:
var http = require('http');

// Create http server and introduce callback function:
var server = http.createServer(function (request, response) {
    // Callback function receives request and response objects
    // Get the method and the url of HTTP request:
    console.log(request.method + ':' + request.url);
    // Write HTTP response status 200 and set Content-Type: text/html:
    response.writeHead(200, {'Content-Type': 'text/html'});
    // Write HTTP response content:
    response.end('<h1>Hello world!</h1>');
});

// Let the server monitor port 8080:
server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');