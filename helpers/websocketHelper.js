const { WebSocket } = require("ws");

exports.isConnectedHelper = (wss, connectionId) => {
    var isClientConnected = false;
    wss.clients.forEach((client) => {
        if(client.connectionId === connectionId){
            isClientConnected = true;
        }
    });
    return isClientConnected;
}

exports.closeConnectionHelper = (wss, connectionId) => {
    wss.clients.forEach((client) => {
        if(client.connectionId === connectionId){
            client.close();
        }
    });
}

exports.sendMessageToSocketHelper = (wss, connectionId, data) => {
    wss.clients.forEach((client) => {
        if(client.connectionId == connectionId){
            if(client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify(data));
            }
        }
    });
}