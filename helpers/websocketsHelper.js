const axios = require('axios');
const { verifyAuthentication } = require('./auth');
const uuid = require('uuid');

exports.authenticateConnection = async(socket, req) => {
    try{
        const isValidUser = await verifyAuthentication(req);

        if(isValidUser === false){
            socket.close();
        }else{
            socket.connectionId = uuid.v4();
            socket.send(JSON.stringify({connectionId: socket.connectionId}));
        }
    }catch(err){
        if(axios.isAxiosError(err)){
            console.log(err.response);
            socket.send(JSON.stringify({
                success: false,
                statusCode: err.response.status,
                error: err.response.data.error,
                message: err.response.data.message
            }));
        }else{
            console.log(err);
            socket.send(JSON.stringify({
                success: false,
                statusCode: err.statusCode,
                error: err.name,
                message: err.message
            }));
        }
        socket.close();
    }
}