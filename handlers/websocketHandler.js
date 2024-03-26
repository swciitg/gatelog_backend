const websocketHelper = require('../helpers/websocketsHelper');

exports.connectionHandler = async(socket, req) => {
    await websocketHelper.authenticateConnection(socket, req);

    // Add event listeners
}