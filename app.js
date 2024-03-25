require('dotenv').config({path: `./.env.${process.env.NODE_ENV}`});

const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on("connection", function connection(ws) {
    
    ws.on("message", function incoming(message) {
    
    });
    
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});