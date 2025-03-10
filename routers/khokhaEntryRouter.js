import express from 'express';
import {khokhaController} from '../controllers/khokhaEntryController.js';
import {khokhaHistoryController} from '../controllers/khokhaHistoryController.js';
import {getUserInfo, verifyUserInfo} from "../middlewares/getUserInfo.js";
import securityKeyMiddleware from "../middlewares/securityKeyMiddleware.js";
import asyncErrorHandler from '../handlers/asyncErrorHandler.js';

const khokhaEntryRouter = express.Router();

khokhaEntryRouter.post("/newEntry", securityKeyMiddleware, 
    getUserInfo, asyncErrorHandler(khokhaController.addNewEntry)
);
khokhaEntryRouter.patch("/closeEntry/:id", 
    securityKeyMiddleware, asyncErrorHandler(khokhaController.closeEntry)
);

khokhaEntryRouter.get("/history", verifyUserInfo, asyncErrorHandler(khokhaHistoryController.userHistory));

export default khokhaEntryRouter;