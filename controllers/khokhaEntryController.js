const ws = require("../app");
const KhokhaEntryModel = require('../models/KhokhaEntryModel');

// TODO: Implement these controllers
exports.addNewEntry = async (req, res, next) => {
    try {
        if(ws.isConnected(req.body.connectionId)===false){
            return res.json({
                success: false,
                eventName: "ERROR",
                message: "Socket is not connected"
            });
        }
        const entry = await KhokhaEntryModel.create({
            outlookEmail: req.body.outlookEmail,
            name: req.body.name,
            rollNumber: req.body.rollNumber,
            hostel: req.body.hostel,
            program: req.body.program,
            branch: req.body.branch,
            outTime: Date(),
            phoneNumber: req.body.phoneNumber,
            roomNumber: req.body.roomNumber,
            destination: req.body.destination,
        });


        ws.sendMessageToSocket(req.body.connectionId, {
            success: true,
            eventName: "ENTRY_ADDED",
            message: "Entry Added to database!",
            data: entry
        });
        ws.closeConnection(req.body.connectionId);

        res.json({
            success: true,
            message: "Entry added to database!"
        });
    } catch (error) {
        next(error);
    }
};

exports.closeEntry = async (req, res, next) => {
    const entryId = req.params.id;
    try {
        if(ws.isConnected(req.body.connectionId)===false){
            return res.json({
                success: false,
                eventName: "ERROR",
                message: "Socket is not connected"
            });
        }

        const entry = await KhokhaEntryModel.findById(entryId);

        if (!entry) {
            ws.sendMessageToSocket(req.body.connectionId, {
                success: false,
                eventName: "ERROR",
                message: "Entry not found!"
            });
            ws.closeConnection(req.body.connectionId);

            return res.status(404).json({
                success: false,
                message: "Entry not found!" 
            });
        } else {
            if(entry.isClosed){
                ws.sendMessageToSocket(req.body.connectionId, {
                    success: false,
                    eventName: "ERROR",
                    message: "Entry Already Closed!",
                });
                ws.closeConnection(req.body.connectionId);

                return res.json({
                    success: false,
                    message: "Entry Already Closed!"
                });
            }

            const newEntry = await KhokhaEntryModel.findByIdAndUpdate(entryId, {
                inTime: Date(),
                isClosed: true
            }, {new: true});

            ws.sendMessageToSocket(req.body.connectionId, {
                success: true,
                eventName: "ENTRY_CLOSED",
                message: "Entry Closed Successfully!",
                data: newEntry
            });
            ws.closeConnection(req.body.connectionId);

            return res.json({
                success: true,
                message: "Entry Closed Successfully!"
            });
        }
    } catch (error) {
        next(error);
    }
};