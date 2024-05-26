import express from 'express';
import {khokhaController} from '../controllers/khokhaEntryController.js';
import {khokhaHistoryController} from '../controllers/khokhaHistoryController.js';
import {getUserInfo} from "../middlewares/getUserInfo.js";

const khokhaEntryRouter = express.Router();

khokhaEntryRouter.post("/newEntry", getUserInfo, khokhaController.addNewEntry);
khokhaEntryRouter.patch("/closeEntry/:id", khokhaController.closeEntry);

// TODO: USE AUTH MIDDLEWARE INSTEAD OF ROLL NUMBER PARAM
khokhaEntryRouter.get("/history/:rollNo", khokhaHistoryController.userHistory);

export default khokhaEntryRouter;