import express from 'express';
import {khokhaController} from '../controllers/khokhaEntryController.js';
import {khokhaHistoryController} from '../controllers/khokhaHistoryController.js';
import {getUserInfo, verifyUserInfo} from "../middlewares/getUserInfo.js";
import securityKeyMiddleware from "../middlewares/securityKeyMiddleware.js";

const khokhaEntryRouter = express.Router();

khokhaEntryRouter.post("/newEntry", securityKeyMiddleware, 
    getUserInfo, khokhaController.addNewEntry
);
khokhaEntryRouter.patch("/closeEntry/:id", 
    securityKeyMiddleware, khokhaController.closeEntry
);

khokhaEntryRouter.get("/history", verifyUserInfo, khokhaHistoryController.userHistory);

export default khokhaEntryRouter;