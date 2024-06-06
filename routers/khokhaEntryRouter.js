import express from 'express';
import {khokhaController} from '../controllers/khokhaEntryController.js';
import {khokhaHistoryController} from '../controllers/khokhaHistoryController.js';
import {getUserInfo, verifyUserInfo} from "../middlewares/getUserInfo.js";

const khokhaEntryRouter = express.Router();

khokhaEntryRouter.post("/newEntry", getUserInfo, khokhaController.addNewEntry);
khokhaEntryRouter.patch("/closeEntry/:id", khokhaController.closeEntry);

khokhaEntryRouter.get("/history", verifyUserInfo, khokhaHistoryController.userHistory);

export default khokhaEntryRouter;