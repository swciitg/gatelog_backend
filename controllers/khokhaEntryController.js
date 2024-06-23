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
                    message: "This QR Code Is No Longer Valid."
                });
            }
            if(req.user._id !== req.body.userId){
                sendMessageToSocket(req.body.connectionId, {
                    success: false,
                    eventName: "ERROR",
                    message: "Conflicting Credentials!",
                });
                closeConnection(req.body.connectionId);
                throw new RequestValidationError("Conflicting Credentials!");
            }
            const entry = await KhokhaEntryModel.create({
                outlookEmail: req.user.outlookEmail,
                name: req.user.name,
                rollNumber: req.user.rollNo,
                hostel: req.user.hostel,
                checkOutTime: Date(),
                phoneNumber: req.user.phoneNumber,
                roomNumber: req.user.roomNo,
                destination: req.body.destination,
                checkOutGate: req.body.checkOutGate,
            });

            sendMessageToSocket(req.body.connectionId, {
                success: true,
                eventName: "ENTRY_ADDED",
                message: "Welcome! Check-in Successful",
                data: entry
            });
            closeConnection(req.body.connectionId);

            res.json({
                success: true,
                message: "Welcome! Check-in Successful"
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
                    message: "This QR Code Is No Longer Valid."
                });
            }

            const entry = await KhokhaEntryModel.findById(entryId);

            if (!entry) {
                sendMessageToSocket(req.body.connectionId, {
                    success: false,
                    eventName: "ERROR",
                    message: "Invalid Code. Please Scan a Valid QR."
                });
                closeConnection(req.body.connectionId);

                return res.status(404).json({
                    success: false,
                    message: "Invalid Code. Please Scan a Valid QR."
                });
            } else {
                if (entry.isClosed) {
                    sendMessageToSocket(req.body.connectionId, {
                        success: false,
                        eventName: "ERROR",
                        message: "Rescan Detected.\nNo Action Needed.",
                    });
                    closeConnection(req.body.connectionId);

                    return res.json({
                        success: false,
                        message: "Rescan Detected.\nNo Action Needed."
                    });
                }

                const newEntry = await KhokhaEntryModel.findByIdAndUpdate(entryId, {
                    checkInTime: Date(),
                    checkInGate: req.body.checkInGate,
                    isClosed: true
                }, {new: true});

                sendMessageToSocket(req.body.connectionId, {
                    success: true,
                    eventName: "ENTRY_CLOSED",
                    message: "Goodbye! Check-out Successful",
                    data: newEntry
                });
                closeConnection(req.body.connectionId);

                return res.json({
                    success: true,
                    message: "Goodbye! Check-out Successful"
                });
            }
        } catch (error) {
            next(error);
        }
    }
};
