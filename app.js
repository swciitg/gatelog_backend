const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const websocketHelper = require('./helpers/websocketsHelper');
const { connectionHandler } = require('./handlers/websocketHandler');
const khokhaEntryRouter = require('./routers/khokhaEntryRouter');
const securityKeyMiddleware = require('./middlewares/securityKeyMiddleware');
const { errorHandler } = require("./middlewares/errorHandler");
const mongoose=require("mongoose");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// TODO: Add User Auth Middleware
app.use(express.json());
app.use('/', khokhaEntryRouter);

app.use(errorHandler);


wss.on('connection', connectionHandler);

exports.onKhokhaEntryAdded = (connectionId, data) => {
    wss.clients.forEach((client) => {
        if(client.connectionId == connectionId){
            websocketHelper.sendMessageToClient(client, data);
        }
    });
}

exports.onkhokhaEntryClosed = (connectionId,data)=>{
    wss.clients.forEach((client)=>{
        if(client.connectionId == connectionId)
        {
            websocketHelper.sendMessageToClient(client, data);
        }
    })
}

server.listen(process.env.PORT, async() => {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log(`Server running on port ${process.env.PORT}`);
});