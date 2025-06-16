import express from 'express';
import {khokhaController} from '../controllers/khokhaEntryController.js';
import {khokhaHistoryController} from '../controllers/khokhaHistoryController.js';
import {getUserInfo, verifyUserInfo} from "../middlewares/getUserInfo.js";
import securityKeyMiddleware from "../middlewares/securityKeyMiddleware.js";
import asyncErrorHandler from '../handlers/asyncErrorHandler.js';
import khokhaEntryModel from '../models/KhokhaEntryModel.js';

const khokhaEntryRouter = express.Router();

khokhaEntryRouter.post("/newEntry", securityKeyMiddleware, 
    getUserInfo, asyncErrorHandler(khokhaController.addNewEntry)
);
khokhaEntryRouter.patch("/closeEntry/:id", 
    securityKeyMiddleware, asyncErrorHandler(khokhaController.closeEntry)
);

khokhaEntryRouter.get("/history", verifyUserInfo, asyncErrorHandler(khokhaHistoryController.userHistory));

khokhaEntryRouter.get("/entries" , async (req, res)=>{
    try{
       const entries= await khokhaEntryModel.find().sort('-createdAt');
        res.render("index", {
             user: req.session.adminUser.email,
             entries });
 } catch(err){
        res.status(500).send("Internal Server Error");
    }
});

khokhaEntryRouter.get("/entries/api", async (req, res) => {
    try {
        const since = req.query.since;
        let query = {};

        if (since) {
            query = { createdAt: { $gt: new Date(since) } };
        }

        const newEntries = await khokhaEntryModel.find(query).sort('-createdAt');
        res.json(newEntries);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});
export default khokhaEntryRouter;