// const express = require("express");
import express from 'express'
const khokhaEntryRouter = express.Router();
// const khokhaController = require("../controllers/khokhaEntryController");
import {khokhaController} from '../controllers/khokhaEntryController.js';
// const khokhaHistoryController=require("../controllers/khokhaHistoryController");
import {khokhaHistoryController} from '../controllers/khokhaHistoryController.js'


khokhaEntryRouter.post("/newEntry", // verifyUserRequest, restrictIfGuest,
    khokhaController.addNewEntry
);
khokhaEntryRouter.patch("/closeEntry/:id", // verifyUserRequest, restrictIfGuest,
    khokhaController.closeEntry
);
khokhaEntryRouter.get("/History/:rollno",khokhaHistoryController.userHistory);

export default khokhaEntryRouter;