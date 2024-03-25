require('dotenv').config({path: `./.env.${process.env.NODE_ENV}`});

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const {isValidJWT, isGuestUser} = require('./helpers/auth');
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on("connection", async(socket, req) => {
    if (req.headers["security-key"] !== process.env.SECURITY_KEY) {
        socket.send(JSON.stringify({ message: "You are not authorized app.js" }));
        socket.close();
    }

    try{
        const isValidUser = await isValidJWT(req);
        const isGuest = await isGuestUser(req);

        if(isValidUser === false || isGuest === true){
            socket.close();
        }else{
            socket.connectionId = uuid.v4();
            socket.send(JSON.stringify({connectionId: socket.connectionId}));
        }
    }catch(err){
        socket.send(JSON.stringify({
            success: false,
            error: err.message
        }));
        socket.close();
    }
    
});

exports.addedKhokhaEntry = (connectionId, entryId, data) => {
    wss.clients.forEach((client) => {
        if(client.connectionId === connectionId && client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify({
                success: true,
                message: "Entry Added Successfully!",
                entryId: entryId,
                data: data
            }));
        }
    })
};

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});