const express = require("express");
const khokhaEntryRouter = express.Router();
const khokhaController = require("../controllers/khokhaEntryController");
const khokhaHistoryController=require("../controllers/khokhaHistoryController");


khokhaEntryRouter.post("/newEntry", // verifyUserRequest, restrictIfGuest,
    khokhaController.addNewEntry
);
khokhaEntryRouter.patch("/closeEntry/:id", // verifyUserRequest, restrictIfGuest,
    khokhaController.closeEntry
);
khokhaEntryRouter.get("/History/:rollno",khokhaHistoryController.userHistory);

module.exports = khokhaEntryRouter;