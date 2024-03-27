const ws = require("../app");


// TODO: Implement these controllers
exports.addNewEntry = async(req, res, next) => {
    ws.onKhokhaEntryAdded(req.body.connectionId, {
        success: true, 
        message: "Entry Added Successfully.",
        entryId: "abcdefgh" // Object Id from mongo document
        
    });
    

    try {
        const {name,rollNumber,department,hostel,roomNumber,Course,outgoingLocation,phoneNumber,outlook,Status} =req.body

  
    const date = Date.parse(req.body.date);
  
    const newFormData = new formData({
      outlook,
      name,
      phoneNumber,
      outgoingLocation,
      rollNumber,
      roomNumber,
      hostel,
      department,
      Course,
      Status
     
    });
  
    newFormData.save()
    
    .then(() => res.json(`Success!+${newFormData}`) )
    } catch (e) {
        res.status(400).json('Error: ' + e)
    }
};

exports.closeEntry = async(req, res, next) => {};