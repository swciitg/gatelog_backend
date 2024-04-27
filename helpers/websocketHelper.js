// const { WebSocket } = require("ws");
import WebSocket from "ws";

export const isConnectedHelper = (wss, connectionId) => {
    console.log(wss.clients);
    var isClientConnected = false;
    wss.clients.forEach((client) => {
        if (client.connectionId === connectionId) {
            isClientConnected = true;
        }
    });
    return isClientConnected;
}

export const closeConnectionHelper = (wss, connectionId) => {
    wss.clients.forEach((client) => {
        if (client.connectionId === connectionId) {
            client.close();
        }
    });
}

export const sendMessageToSocketHelper = (wss, connectionId, data) => {
    wss.clients.forEach((client) => {
        if (client.connectionId == connectionId) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        }
    });
}