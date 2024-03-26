const express = require("express");
const khokhaEntryRouter = express.Router();
const khokhaController = require("../controllers/khokhaEntryController");

// TODO: Implement these middlewares
// const { verifyUserRequest, restrictIfGuest } = require("../middlewares/userAuth.js");

khokhaEntryRouter.post("/newEntry", // verifyUserRequest, restrictIfGuest,
    khokhaController.addNewEntry
);
khokhaEntryRouter.patch("/closeEntry/:id", // verifyUserRequest, restrictIfGuest,
    khokhaController.closeEntry
);

module.exports = khokhaEntryRouter;