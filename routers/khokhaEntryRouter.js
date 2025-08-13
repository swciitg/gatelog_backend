import express from 'express';
import { khokhaController } from '../controllers/khokhaEntryController.js';
import { khokhaHistoryController } from '../controllers/khokhaHistoryController.js';
import { getUserInfo, verifyUserInfo } from "../middlewares/getUserInfo.js";
import securityKeyMiddleware from "../middlewares/securityKeyMiddleware.js";
import asyncErrorHandler from '../handlers/asyncErrorHandler.js';
import KhokhaEntryModel from '../models/KhokhaEntryModel.js';

const khokhaEntryRouter = express.Router();

khokhaEntryRouter.post(
  "/newEntry",
  securityKeyMiddleware,
  getUserInfo,
  asyncErrorHandler(khokhaController.addNewEntry)
);

khokhaEntryRouter.patch(
  "/closeEntry/:id",
  securityKeyMiddleware,
  asyncErrorHandler(khokhaController.closeEntry)
);

khokhaEntryRouter.get(
  "/history",
  verifyUserInfo,
  asyncErrorHandler(khokhaHistoryController.userHistory)
);

khokhaEntryRouter.get("/entries", async (req, res) => {
  try {
    const entries = await KhokhaEntryModel.find().sort('-createdAt').lean();
    res.render("index", {
      user: req.session.user,
      entries,
      BASE_URL: req.app.locals.BASE_URL
    });
  } catch (err) {
    console.error(err);
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
    const newEntries = await KhokhaEntryModel.find(query).sort('-createdAt').lean();
    res.json(newEntries);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

khokhaEntryRouter.get("/entries/new", (req, res) => {
  res.render("add-entry", { BASE_URL: req.app.locals.BASE_URL });
});

// New lookup endpoint (dummy data for now)
khokhaEntryRouter.post("/entries/lookup", async (req, res) => {
  try {
    const { name, rollNumber } = req.body || {};
    if (!name || !rollNumber) {
      return res.status(400).send("Missing name or rollNumber");
    }

    // --- Real API fetch  ---
    /*
    const externalUrl = process.env.SWC_LOOKUP_URL;
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.SWC_LOOKUP_TOKEN) {
      headers.Authorization = `Bearer ${process.env.SWC_LOOKUP_TOKEN}`;
    }
    const upstream = await fetch(externalUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, rollNumber })
    });
    if (!upstream.ok) {
      const t = await upstream.text();
      return res.status(upstream.status).send(t || 'External lookup failed');
    }
    const data = await upstream.json();
    */

    // --- Hardcoded dummy data---
    const data = {
      outlookEmail: `${name.toLowerCase().replace(/\s+/g, '')}@iitg.ac.in`,
      phoneNumber: "9999999999",
      hostel: "KAMENG",
      roomNumber: "B2-201"
    };

    return res.json(data);
  } catch (err) {
    console.error("Lookup error:", err);
    res.status(500).send("Internal lookup error");
  }
});

// Save new entry to DB
khokhaEntryRouter.post("/entries", async (req, res, next) => {
  try {
    const {
      name,
      rollNumber,
      outlookEmail,
      phoneNumber,
      hostel,
      roomNumber,
      destination,
      checkOutTime,
      checkOutGate,
      checkInTime,
      checkInGate,
      isClosed
    } = req.body;

    const doc = new KhokhaEntryModel({
      name,
      rollNumber,
      outlookEmail,
      phoneNumber,
      hostel,
      roomNumber,
      destination,
      checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
      checkOutGate,
      checkInTime: checkInTime ? new Date(checkInTime) : null,
      checkInGate: checkInGate || null,
      isClosed: Boolean(isClosed),
    });

    await doc.validate();
    await doc.save();

    res.redirect(`${req.app.locals.BASE_URL}/entries`);
  } catch (err) {
    console.error("Create entry error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).send(
        Object.values(err.errors).map(e => e.message).join('; ')
      );
    }
    next(err);
  }
});

export default khokhaEntryRouter;
