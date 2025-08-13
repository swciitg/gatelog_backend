import express from 'express';
import { khokhaController } from '../controllers/khokhaEntryController.js';
import { khokhaHistoryController } from '../controllers/khokhaHistoryController.js';
import { getUserInfo, verifyUserInfo } from "../middlewares/getUserInfo.js";
import securityKeyMiddleware from "../middlewares/securityKeyMiddleware.js";
import asyncErrorHandler from '../handlers/asyncErrorHandler.js';
import KhokhaEntryModel from '../models/KhokhaEntryModel.js';
import * as XLSX from 'xlsx';
import { Hostels } from '../shared/enums.js';
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


khokhaEntryRouter.get("/entries/export", /* verifyUserInfo, */ (req, res) => {
  try {
    const hostels = Object.values(Hostels || {});
    res.render("export-entries", { BASE_URL: req.app.locals.BASE_URL, hostels });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// ---- Handle Export (CSV/Excel)
khokhaEntryRouter.post("/entries/export", async (req, res) => {
  try {
    const {
      dateField = 'createdAt',
      from,
      to,
      name,
      rollNumber,
      hostel,
      roomNumber,
      destination,
      checkOutGate,
      checkInGate,
      isClosed,   // 'true' | 'false' | ''
      format = 'csv'
    } = req.body;

    // Build query
    const q = {};

    // Date range
    if (!from || !to) {
      return res.status(400).send('Please provide both "from" and "to" date/time.');
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate) || isNaN(toDate)) {
      return res.status(400).send('Invalid date format.');
    }
    q[dateField] = { $gte: fromDate, $lte: toDate };

    // Optional string filters
    if (name) {
      q.name = { $regex: name, $options: 'i' }; // contains, case-insensitive
    }
    if (rollNumber) {
      q.rollNumber = rollNumber; // exact
    }
    if (hostel) {
      q.hostel = hostel;
    }
    if (roomNumber) {
      q.roomNumber = roomNumber;
    }
    if (destination) {
      q.destination = { $regex: destination, $options: 'i' };
    }
    if (checkOutGate) {
      q.checkOutGate = checkOutGate;
    }
    if (checkInGate) {
      q.checkInGate = checkInGate;
    }
    if (isClosed === 'true') q.isClosed = true;
    if (isClosed === 'false') q.isClosed = false;

    // Fetch
    const docs = await KhokhaEntryModel.find(q).sort('-' + dateField).lean();

    // Prepare flat rows for export (format dates nicely)
    const rows = docs.map(d => ({
      Name: d.name,
      RollNumber: d.rollNumber,
      OutlookEmail: d.outlookEmail,
      PhoneNumber: d.phoneNumber,
      Hostel: d.hostel,
      RoomNumber: d.roomNumber,
      Destination: d.destination,
      CheckOutGate: d.checkOutGate,
      CheckOutTime: d.checkOutTime ? new Date(d.checkOutTime).toISOString() : '',
      CheckInGate: d.checkInGate || '',
      CheckInTime: d.checkInTime ? new Date(d.checkInTime).toISOString() : '',
      Status: d.isClosed ? 'Closed' : 'Open',
      CreatedAt: d.createdAt ? new Date(d.createdAt).toISOString() : '',
      UpdatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : '',
      _id: d._id?.toString() || ''
    }));

    const filenameBase = `khokha-entries-${dateField}-${fromDate.toISOString().slice(0,16)}_${toDate.toISOString().slice(0,16)}`.replace(/[:]/g, '-');

    if (format === 'xlsx') {
      // Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, "Entries");
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buf);
    } else {
      // CSV
      const ws = XLSX.utils.json_to_sheet(rows);
      const csv = XLSX.utils.sheet_to_csv(ws);

      res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.csv"`);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      return res.send(csv);
    }
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).send("Export failed.");
  }
});

export default khokhaEntryRouter;
