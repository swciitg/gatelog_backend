import WebSocket from "ws";

export const isConnectedHelper = (wss, connectionId) => {
    let isClientConnected = false;
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
            console.log(`Closing connection: ${connectionId}`);
            client.close();
        }
    });
}

export const sendMessageToSocketHelper = (wss, connectionId, data) => {
    wss.clients.forEach((client) => {
        if (client.connectionId === connectionId) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        }
    });
}