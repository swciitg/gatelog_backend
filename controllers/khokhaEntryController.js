const ws = require("../app");


// TODO: Implement these controllers
exports.addNewEntry = async(req, res, next) => {
    ws.onKhokhaEntryAdded(req.body.connectionId, {
        success: true, 
        message: "Entry Added Successfully.",
        entryId: "abcdefgh" // Object Id from mongo document
    });


    return res.json({status: "Success"});
};

exports.closeEntry = async(req, res, next) => {};