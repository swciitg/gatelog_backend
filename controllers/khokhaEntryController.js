import {closeConnection, isConnected, sendMessageToSocket} from '../app.js';
import {RequestValidationError} from "../errors/requestValidationError.js";

import KhokhaEntryModel from '../models/KhokhaEntryModel.js';

export const khokhaController = {
    addNewEntry: async (req, res, next) => {
        try {
            console.log(req.body);
            if (isConnected(req.body.connectionId) === false) {
                return res.json({
                    success: false,
                    eventName: "ERROR",
                    message: "QR Code is expired!\nPlease try again."
                });
            }
            if(req.user._id !== req.body.userId){
                sendMessageToSocket(req.body.connectionId, {
                    success: false,
                    eventName: "ERROR",
                    message: "Conflicting Credentials!",
                });
                closeConnection(req.body.connectionId);
                next(new RequestValidationError("Conflicting Credentials!"));
            }
            const entry = await KhokhaEntryModel.create({
                outlookEmail: req.user.outlookEmail,
                name: req.user.name,
                rollNumber: req.user.rollNo,
                hostel: req.user.hostel,
                outTime: Date(),
                phoneNumber: req.user.phoneNumber,
                roomNumber: req.user.roomNo,
                destination: req.body.destination,
                exitGate: req.body.exitGate,
            });

            sendMessageToSocket(req.body.connectionId, {
                success: true,
                eventName: "ENTRY_ADDED",
                message: "Entry Added to database!",
                data: entry
            });
            closeConnection(req.body.connectionId);

            res.json({
                success: true,
                message: "Entry added to database!"
            });
        } catch (error) {
            next(error);
        }
    },

    closeEntry: async (req, res, next) => {
        const entryId = req.params.id;
        try {
            if (isConnected(req.body.connectionId) === false) {
                return res.json({
                    success: false,
                    eventName: "ERROR",
                    message: "QR Code is expired!\nPlease try again."
                });
            }

            const entry = await KhokhaEntryModel.findById(entryId);

            if (!entry) {
                sendMessageToSocket(req.body.connectionId, {
                    success: false,
                    eventName: "ERROR",
                    message: "Entry not found!"
                });
                closeConnection(req.body.connectionId);

                return res.status(404).json({
                    success: false,
                    message: "Entry not found!"
                });
            } else {
                if (entry.isClosed) {
                    sendMessageToSocket(req.body.connectionId, {
                        success: false,
                        eventName: "ERROR",
                        message: "Entry Already Closed!",
                    });
                    closeConnection(req.body.connectionId);

                    return res.json({
                        success: false,
                        message: "Entry Already Closed!"
                    });
                }

                const newEntry = await KhokhaEntryModel.findByIdAndUpdate(entryId, {
                    inTime: Date(),
                    entryGate: req.body.entryGate,
                    isClosed: true
                }, {new: true});

                sendMessageToSocket(req.body.connectionId, {
                    success: true,
                    eventName: "ENTRY_CLOSED",
                    message: "Entry Closed Successfully!",
                    data: newEntry
                });
                closeConnection(req.body.connectionId);

                return res.json({
                    success: true,
                    message: "Entry Closed Successfully!"
                });
            }
        } catch (error) {
            next(error);
        }
    }
};
