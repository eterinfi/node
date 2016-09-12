// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// Server类实例化:
const wss = new WebSocketServer({
    port: 3000
});

// Server端绑定事件(连接后立即发送消息，响应收到的消息并发送消息):
wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        ws.send(`ECHO: ${message}`, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
    });
});

// Client类实例化:
let ws = new WebSocket('ws://localhost:3000/any/path');

// Client端绑定事件(打开WebSocket连接后立即发送消息):
ws.on('open', function () {
    console.log(`[CLIENT] open()`);
    ws.send('Hello!');
});
// Client断绑定事件(响应收到的消息):
ws.on('message', function (message) {
    console.log(`[CLIENT] Received: ${message}`);
});
