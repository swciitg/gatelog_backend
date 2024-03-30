const express = require("express");
const khokhaEntryRouter = express.Router();
const khokhaController = require("../controllers/khokhaEntryController");


khokhaEntryRouter.post("/newEntry", khokhaController.addNewEntry);
khokhaEntryRouter.patch("/closeEntry/:id", khokhaController.closeEntry);

module.exports = khokhaEntryRouter;