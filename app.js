const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { connectionHandler } = require('./handlers/websocketHandler');
const khokhaEntryRouter = require('./routers/khokhaEntryRouter');
const { errorHandler } = require("./middlewares/errorHandler");
const mongoose=require("mongoose");
const securityKeyMiddleware = require("./middlewares/securityKeyMiddleware");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (req, socket, head) => {
    if(req.url === process.env.WEBSOCKET_CONNECTION_PATH){
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});

app.use((req, res, next) => {
    console.log(req.method + '\t' + req.url);
    next();
});
app.use(express.json());
app.use(securityKeyMiddleware);
app.use(process.env.BASE_URL, khokhaEntryRouter);
app.use(errorHandler);

wss.on('connection', connectionHandler);

exports.sendMessageToSocket = (connectionId, data) => {
    wss.clients.forEach((client) => {
        if(client.connectionId == connectionId){
            if(client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify(data));
            }
        }
    });
}

exports.isConnected = (connectionId) => {
    var isClientConnected = false;
    wss.clients.forEach((client) => {
        if(client.connectionId === connectionId){
            isClientConnected = true;
        }
    });
    return isClientConnected;
}

exports.closeConnection = (connectionId) => {
    wss.clients.forEach((client) => {
        if(client.connectionId === connectionId){
            client.close();
        }
    });
}

server.listen(process.env.PORT, async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Connected to database");
    }catch(e){
        console.log(e.message);
    }
    console.log(`Server running on port ${process.env.PORT}`);
});