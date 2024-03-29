const { connect } = require("mongoose");
const ws = require("../app");
let khokhaEntryModel = require('../models/khokhaEntryModel');


// TODO: Implement these controllers
exports.addNewEntry = async(req, res, next) => {
    
    ws.onKhokhaEntryAdded(req.body.connectionId, {
        success: true, 
        message: "Entry Added Successfully.",
        entryId: "abcdefgh" // Object Id from mongo document
        
    });
    

    try {
        const {outlookEmail,name,phoneNumber,outgoingLocation,rollNumber,roomNumber,hostel,department,program,connectionId} =req.body

  
    const date = Date.parse(req.body.date);
  
    const newFormData = new khokhaEntryModel({
      outlookEmail,
      name,
      phoneNumber,
      outgoingLocation,
      rollNumber,
      roomNumber,
      hostel,
      department,
      program,
      connectionId

    });
  console.log(newFormData)
    newFormData.save()
    
    .then(() => res.json(`Success!+${newFormData}`) )
    } catch (e) {
        console.error(e);;
        res.status(400).json('Error: ' + e)
    }
};

exports.closeEntry = async(req, res, next) => {

    const entryId = req.params.id; 

    try {
        const entry = await khokhaEntryModel.findById(entryId);

        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        else{
            ws.onkhokhaEntryClosed(req.body.connectionId, {
                success: true, 
                message: "Entry Closed Successfully.",
            });
            entry.entryTime = new Date();
            entry.status=true;
            await entry.save()
            .then(() =>res.json({ message: "Entry closed successfully", entry }) );
        }
    } catch (error) {
        res.status(500).json({ message: "Error closing entry", error });
    }
};