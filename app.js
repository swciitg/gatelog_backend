require('dotenv').config({path: `./.env.${process.env.NODE_ENV}`});

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const websocketHelper = require('./helpers/websocketsHelper');
const { connectionHandler } = require('./handlers/websocketHandler');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', connectionHandler);

exports.onKhokhaEntryAdded = (connectionId, data) => {
    wss.clients.forEach((client) => {
        if(client.connectionId == connectionId){
            websocketHelper.sendMessageToClient(client, data);
        }
    });
}

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});