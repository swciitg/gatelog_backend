import axios from 'axios';
import {verifyAuthentication} from '../helpers/verifyAuthentication.js';

import {v4 as uuidv4} from 'uuid';

const uuid = uuidv4();


export const connectionHandler = async (socket, req, _client) => {
    socket.on('error', console.error);
    try {
        const isValidUser = await verifyAuthentication(req);
        if (isValidUser === false) {
            socket.close();
        } else {
            socket.connectionId = uuid.v4();
            socket.send(JSON.stringify({
                eventName: 'CONNECTION',
                connectionId: socket.connectionId
            }));
            setTimeout(() => {
                socket.send(JSON.stringify({
                    eventName: "TIMEOUT",
                    message: 'Timeout'
                }));
                socket.close();
            }, 15000);
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response !== undefined) {
                socket.send(JSON.stringify({
                    success: false,
                    eventName: "ERROR",
                    statusCode: err.response.status,
                    error: err.response.data.error,
                    message: err.response.data.message
                }));
            } else {
                socket.send(JSON.stringify({
                    success: false,
                    eventName: "ERROR",
                    statusCode: 500,
                    error: 'Internal Server Error',
                    message: err.message
                }))
            }
        } else {
            socket.send(JSON.stringify({
                success: false,
                eventName: "ERROR",
                statusCode: err.statusCode,
                error: err.name,
                message: err.message
            }));
        }
        socket.close();
    }
}