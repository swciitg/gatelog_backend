import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import {connectionHandler} from './handlers/websocketHandler.js';
import khokhaEntryRouter from './routers/khokhaEntryRouter.js';
import {errorHandler} from './middlewares/errorHandler.js';
import './helpers/websocketHelper.js';
import {WebSocketServer} from 'ws';
import {closeConnectionHelper, isConnectedHelper, sendMessageToSocketHelper} from "./helpers/websocketHelper.js";
import {adminRouter} from "./admin_panel/adminConfig.js";
import securityKeyMiddleware from "./middlewares/securityKeyMiddleware.js";


const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({noServer: true});

wss.on('connection', connectionHandler);

// UPGRADES HTTP CONNECTION TO WS FOR THE WEBSOCKET ENDPOINT
server.on('upgrade', (req, socket, head) => {

    if (req.url === process.env.WEBSOCKET_CONNECTION_PATH) {

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
app.use(process.env.ADMIN_PANEL_ROOT_PATH, adminRouter);
app.use(securityKeyMiddleware);
app.use(process.env.BASE_URL, khokhaEntryRouter);

app.use(errorHandler);

export const sendMessageToSocket = (id, data) => sendMessageToSocketHelper(wss, id, data);
export const isConnected = (id) => isConnectedHelper(wss, id);
export const closeConnection = (id) => closeConnectionHelper(wss, id);


server.listen(process.env.PORT, async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI + '/' + process.env.DATABASE_NAME);
        console.log("Connected to database");
    } catch (e) {
        console.log(e.message);
    }
    console.log(`Server running on port ${process.env.PORT}`);
});