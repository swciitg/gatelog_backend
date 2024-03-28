const express = require("express");
const khokhaEntryRouter = express.Router();
const khokhaController = require("../controllers/khokhaEntryController");
const {verifyUserRequest} = require("../middlewares/userAuth")
// TODO: Implement these middlewares
// const { verifyUserRequest, restrictIfGuest } = require("../middlewares/userAuth.js");

khokhaEntryRouter.post("/newEntry",  verifyUserRequest, 
    khokhaController.addNewEntry
);
khokhaEntryRouter.patch("/closeEntry/:id", // verifyUserRequest, restrictIfGuest,
    khokhaController.closeEntry
);

module.exports = khokhaEntryRouter;