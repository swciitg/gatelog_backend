const {isValidJWT, isGuestUser} = require('./auth');
const uuid = require('uuid');
const WebSocket = require('ws');

exports.authenticateConnection = async(socket, req) => {
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
}

exports.sendMessageToClient = (client, data) => {
    if(client.readyState === WebSocket.OPEN){
        client.send(JSON.stringify(data));
    }
};