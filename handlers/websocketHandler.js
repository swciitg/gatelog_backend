const axios = require('axios');
const { verifyAuthentication } = require('../helpers/auth');
const uuid = require('uuid');

exports.connectionHandler = async(socket, req) => {
    try{
        const isValidUser = await verifyAuthentication(req);

        if(isValidUser === false){
            socket.close();
        }else{
            socket.connectionId = uuid.v4();
            socket.send(JSON.stringify({connectionId: socket.connectionId}));
            setTimeout(() => {
                socket.send(JSON.stringify({
                    message: 'Timeout'
                }));
                socket.close();
            }, 15000);
        }
    }catch(err){
        if(axios.isAxiosError(err)){
            if(err.response !== undefined){
                socket.send(JSON.stringify({
                    success: false,
                    statusCode: err.response.status,
                    error: err.response.data.error,
                    message: err.response.data.message
                }));
            }else{
                socket.send(JSON.stringify({
                    success: false,
                    statusCode: 500,
                    error: 'Internal Server Error',
                    message: err.message
                }))
            }
        }else{
            socket.send(JSON.stringify({
                success: false,
                statusCode: err.statusCode,
                error: err.name,
                message: err.message
            }));
        }
        socket.close();
    }
    // Add event listeners
}