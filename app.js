 //require('dotenv').config({path: `./.env.${process.env.NODE_ENV}`});
 import dotenv from 'dotenv';
 dotenv.config();
 
// const express=require('express');
import express from 'express';
import http from 'http';
// const http = require("http");
import {WebSocketServer} from 'ws';


// const WebSocket = require("ws");
// const { connectionHandler } = require('./handlers/websocketHandler');
import { connectionHandler } from './handlers/websocketHandler.js';

import khokhaEntryRouter from './routers/khokhaEntryRouter.js';
// const khokhaEntryRouter = require('./routers/khokhaEntryRouter');
// const { errorHandler } = require("./middlewares/errorHandler");
import {errorHandler} from './middlewares/errorHandler.js';
// const mongoose=require("mongoose");
import mongoose from 'mongoose';
// const securityKeyMiddleware = require("./middlewares/securityKeyMiddleware");
import securityKeyMiddleware from './middlewares/securityKeyMiddleware.js';
// const { isConnectedHelper, closeConnectionHelper, sendMessageToSocketHelper } = require('./helpers/websocketHelper');
import {isConnectedHelper,closeConnectionHelper,sendMessageToSocketHelper} from './helpers/websocketHelper.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer.Server({ noServer: true });

// UPGRADES HTTP CONNECTION TO WS FOR THE WEBSOCKET ENDPOINT
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
// app.use(process.env.BASE_URL, khokhaEntryRouter);
app.use('/', khokhaEntryRouter);
app.use(errorHandler);

wss.on('connection', connectionHandler);

export const sendMessageToSocket = (id, data) => sendMessageToSocketHelper(wss, id, data);
export const isConnected = (id) => isConnectedHelper(wss, id);
export const closeConnection = (id) => closeConnectionHelper(wss, id);


server.listen(process.env.PORT, async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Connected to database");
    }catch(e){
        console.log(e.message);
    }
    console.log(`Server running on port ${process.env.PORT}`);
});