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
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();
const escapeRegex = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const GATELOG_SECRET_KEY = process.env.GATELOG_SECRET_KEY;
const ONESTOP_LOOKUP_URL = process.env.ONESTOP_LOOKUP_URL;

function hmacHex(rollNo) {
  return crypto.createHmac("sha256", GATELOG_SECRET_KEY)
    .update(String(rollNo), "utf8")
    .digest("hex");
}

function decryptAesGcm(compact) {
  const [ivB64, tagB64, ctB64] = String(compact).split(".");
  if (!ivB64 || !tagB64 || !ctB64) throw new Error("Malformed encrypted payload");
  const key = crypto.createHash("sha256").update(GATELOG_SECRET_KEY, "utf8").digest();
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ct  = Buffer.from(ctB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(ct), decipher.final()]);
  return out.toString("utf8");
}

/* -------------------- LOOKUP -------------------- */
khokhaEntryRouter.post("/entries/lookup", async (req, res) => {
  try {
    if (!GATELOG_SECRET_KEY) return res.status(500).send("Server misconfig: GATELOG_SECRET_KEY missing");
    if (!ONESTOP_LOOKUP_URL) return res.status(500).send("Server misconfig: ONESTOP_LOOKUP_URL missing");

    const rollNo = (req.body?.rollNo || req.body?.rollNumber || "").trim();
    if (!rollNo) return res.status(400).send("rollNo is required");

    const token = hmacHex(rollNo);
    const url = new URL(ONESTOP_LOOKUP_URL);
    url.searchParams.set("rollNo", rollNo);
    url.searchParams.set("token", token);

    const upstream = await fetch(url.toString(), { method: "GET", headers: { Accept: "application/json" } });
    if (!upstream.ok) {
      const t = await upstream.text().catch(() => "");
      return res.status(upstream.status).send(t || "External lookup failed");
    }

    const secureResp = await upstream.json();
    if (!secureResp?.success || !secureResp?.data) {
      return res.status(502).send("Invalid response from secure lookup");
    }

    const user = JSON.parse(decryptAesGcm(secureResp.data));
    const outlookEmail = user.outlookEmail || "";
    const phoneNumber = typeof user.phoneNumber === "number" ? String(user.phoneNumber).padStart(10, "0") : (user.phoneNumber || "");
    const hostel = user.hostel || "";
    const roomNumber = user.roomNo || user.roomNumber || "";
    const name = user.name || "";

    return res.json({ outlookEmail, phoneNumber, hostel, roomNumber, name });
  } catch (err) {
    console.error("Lookup error:", err);
    res.status(500).send("Internal lookup error");
  }
});

/* -------------------- EXISTING ROUTES -------------------- */
khokhaEntryRouter.post("/newEntry",
  securityKeyMiddleware,
  getUserInfo,
  asyncErrorHandler(khokhaController.addNewEntry)
);

khokhaEntryRouter.patch("/closeEntry/:id",
  securityKeyMiddleware,
  asyncErrorHandler(khokhaController.closeEntry)
);

khokhaEntryRouter.get("/history",
  verifyUserInfo,
  asyncErrorHandler(khokhaHistoryController.userHistory)
);

// khokhaEntryRouter.get("/entries", (req, res) => {
//   if (!req.session.user) {
//         return res.redirect(process.env.BASE_URL +'/new/admin/login');
//     }
//   res.render("index", {
//     user: req.session.user,
//     BASE_URL: req.app.locals.BASE_URL
//   });
// });

khokhaEntryRouter.post("/entries/table", async (req, res) => {
  try {
    // DataTables standard fields
    const draw   = Number(req.body.draw || 1);
    const start  = Math.max(Number(req.body.start || 0), 0);
    const length = Math.min(Math.max(Number(req.body.length || 25), 1), 200); // cap page size
    const filters = req.body.filters || {};

    // ---------- Build Mongo query ----------
    const base = {};  // simple predicates
    const and  = [];  // advanced predicates that need $expr, etc.

    if (filters.name)       base.name         = { $regex: escapeRegex(filters.name), $options: 'i' };
    if (filters.rollNumber) base.rollNumber   = String(filters.rollNumber).trim();
    if (filters.outlook)    base.outlookEmail = { $regex: escapeRegex(filters.outlook), $options: 'i' };

    // Phone stored as Number -> search as string using $expr+$toString
    if (filters.phone) {
      const v = String(filters.phone).trim();
      and.push({
        $expr: {
          $regexMatch: {
            input: { $toString: "$phoneNumber" },
            regex: escapeRegex(v),
            options: "i"
          }
        }
      });
    }

    if (filters.hostel)      base.hostel       = filters.hostel;
    if (filters.room)        base.roomNumber   = filters.room;
    if (filters.destination) base.destination  = filters.destination; // City | Khoka | Other
    if (filters.outGate)     base.checkOutGate = filters.outGate;
    if (filters.inGate) {
      base.checkInGate = (filters.inGate === '—') ? { $in: [null, '', undefined] } : filters.inGate;
    }
    if (filters.status === 'Open')   base.isClosed = false;
    if (filters.status === 'Closed') base.isClosed = true;

    // Date ranges (apply -5h30m for BOTH checkOutTime & checkInTime)
    const OFFSET = 330 * 60 * 1000;
    const needsOffset = (field) => field === 'checkOutTime' || field === 'checkInTime';
    const addRange = (field, from, to) => {
      if (!from && !to) return;
      const r = {};
      if (from) {
        const d = new Date(from);
        r.$gte = needsOffset(field) ? new Date(d.getTime() - OFFSET) : d;
      }
      if (to) {
        const d = new Date(to);
        r.$lte = needsOffset(field) ? new Date(d.getTime() - OFFSET) : d;
      }
      base[field] = r;
    };
    addRange('checkOutTime', filters.coFrom, filters.coTo);
    addRange('checkInTime',  filters.ciFrom, filters.ciTo);

    // Merge base + and into the final query
    const q = and.length
      ? (Object.keys(base).length ? { $and: [base, ...and] } : { $and: and })
      : base;

    // ---------- Query ----------
    const sort = { updatedAt: -1, createdAt: -1 }; // latest first

    const [recordsTotal, recordsFiltered, rows] = await Promise.all([
      KhokhaEntryModel.estimatedDocumentCount(),   // fast total (unfiltered)
      KhokhaEntryModel.countDocuments(q),          // filtered total
      KhokhaEntryModel.find(q)
        .sort(sort)
        .skip(start)
        .limit(length)
        .lean()
        .select({
          name: 1, rollNumber: 1, outlookEmail: 1, phoneNumber: 1,
          hostel: 1, roomNumber: 1, destination: 1,
          checkOutTime: 1, checkOutGate: 1,
          checkInTime: 1, checkInGate: 1,
          isClosed: 1, createdAt: 1, updatedAt: 1
        })
    ]);

    // Shape rows for the front-end (keep raw ISO for time)
    const data = rows.map(d => ({
      _id:          d._id.toString(),
      name:         d.name || '',
      rollNumber:   d.rollNumber || '',
      outlookEmail: d.outlookEmail || '',
      phoneNumber:  d.phoneNumber || '',
      hostel:       d.hostel || '',
      roomNumber:   d.roomNumber || '',
      destination:  d.destination || '',
      isClosed:     !!d.isClosed,
      checkOutGate: d.checkOutGate || '',
      checkInGate:  d.checkInGate || '',
      checkOutTime: d.checkOutTime ? new Date(d.checkOutTime).toISOString() : '',
      checkInTime:  d.checkInTime ? new Date(d.checkInTime).toISOString() : '',
      updatedAtISO: d.updatedAt ? new Date(d.updatedAt).toISOString()
                                : (d.createdAt ? new Date(d.createdAt).toISOString() : '')
    }));

    res.json({ draw, recordsTotal, recordsFiltered, data });
  } catch (err) {
    console.error("entries/table error:", err);
    res.status(500).json({ error: "Failed to load entries" });
  }
});

/**
 * Poll API
 */
khokhaEntryRouter.get("/entries/api", async (req, res) => {
  try {
    const { sinceUpdated, since } = req.query;
    const query = {};

    if (sinceUpdated) {
      const t = new Date(sinceUpdated);
      if (!isNaN(t)) query.updatedAt = { $gt: t };
    } else if (since) {
      const t = new Date(since);
      if (!isNaN(t)) query.createdAt = { $gt: t };
    }

    const results = await KhokhaEntryModel.find(query)
      .sort('-updatedAt')
      .lean()
      .select({
        name: 1, rollNumber: 1, outlookEmail: 1, phoneNumber: 1,
        hostel: 1, roomNumber: 1, destination: 1,
        checkOutTime: 1, checkOutGate: 1,
        checkInTime: 1, checkInGate: 1,
        isClosed: 1, createdAt: 1, updatedAt: 1,
      });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

khokhaEntryRouter.get("/new/entries", (req, res) => {
  if (!req.session.user) {
        return res.redirect(process.env.BASE_URL +'/new/admin/login');
    }
  res.render("add-entry", { BASE_URL: req.app.locals.BASE_URL });
});

/* -------------------- AUTO-CLOSE & CREATE NEW -------------------- */
khokhaEntryRouter.post("/entries", async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect(process.env.BASE_URL +'/new/admin/login');
    }
  try {
    const {
      name, rollNumber, outlookEmail, phoneNumber, hostel, roomNumber,
      destination, checkOutTime, checkOutGate, checkInTime, checkInGate
    } = req.body;

    if (!rollNumber) return res.status(400).send("rollNumber is required");

    // 1) Close any open entries for this roll
    await KhokhaEntryModel.updateMany(
      { rollNumber, isClosed: false },
      { $set: { isClosed: true, updatedAt: new Date() } }
    );

    // 2) Determine closure:
    let checkInTimeDate = null;
    let closedNow = false;

    if (checkInTime) {
      checkInTimeDate = new Date(checkInTime);
      closedNow = true;
    } else if (checkInGate) {
      checkInTimeDate = new Date();   // auto-fill now if gate chosen
      closedNow = true;
    }

    // 3) Create the new entry
    const doc = new KhokhaEntryModel({
      name,
      rollNumber,
      outlookEmail,
      phoneNumber,
      hostel,
      roomNumber,
      destination,
      checkOutTime: checkOutTime ? new Date(new Date(checkOutTime).getTime() - 330 * 60 * 1000) : undefined,
      checkOutGate,
      checkInTime: checkInTimeDate,            // null if still open
      checkInGate: checkInGate || null,
      isClosed: closedNow,
    });

    await doc.validate();
    await doc.save();

    res.redirect(`${req.app.locals.BASE_URL}/new/admin`);
  } catch (err) {
    console.error("Create entry error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).send(Object.values(err.errors).map(e => e.message).join('; '));
    }
    next(err);
  }
});

/* -------------------- CLOSE OPEN ENTRY BY ROLL (no admin key) -------------------- */
khokhaEntryRouter.post("/entries/close-by-roll", async (req, res) => {
    if (!req.session.user) {
        return res.redirect(process.env.BASE_URL +'/new/admin/login');
    }
  try {
    const { rollNumber, checkInGate, checkInTime } = req.body || {};
    if (!rollNumber) return res.status(400).send("rollNumber is required");

    const openDoc = await KhokhaEntryModel.findOne({ rollNumber, isClosed: false })
      .sort('-createdAt');

    if (!openDoc) return res.status(404).send("No open entry for this roll number.");

    openDoc.isClosed    = true;
    openDoc.checkInGate = checkInGate || openDoc.checkInGate || "AUTO_CLOSED";
    openDoc.checkInTime = checkInTime ? new Date(checkInTime) : (openDoc.checkInTime || new Date());
    openDoc.updatedAt   = new Date();

    await openDoc.save();

    return res.json({
      ok: true,
      id: openDoc._id.toString(),
      updated: {
        isClosed: openDoc.isClosed,
        checkInGate: openDoc.checkInGate,
        checkInTime: openDoc.checkInTime
      }
    });
  } catch (err) {
    console.error("Close-by-roll error:", err);
    res.status(500).send("Failed to close entry.");
  }
});

/* -------------------- EXPORT + PREVIEW -------------------- */
// khokhaEntryRouter.get("/entries/export", (req, res) => {
//   try {
//     const hostels = Object.values(Hostels || {});
//     res.render("export-entries", { BASE_URL: req.app.locals.BASE_URL, hostels });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// UPDATED: export current filtered set (same query semantics as /entries/table)
khokhaEntryRouter.post("/entries/export", async (req, res) => {
  try {
    const { format = 'csv' } = req.body;

    // If UI sent the DataTables filters verbatim
    if (req.body.filters) {
      let filters;
      try {
        filters = JSON.parse(req.body.filters || '{}');
      } catch {
        return res.status(400).send('Invalid filters payload.');
      }

      const base = {};
      const and  = [];

      if (filters.name)       base.name         = { $regex: escapeRegex(filters.name), $options: 'i' };
      if (filters.rollNumber) base.rollNumber   = String(filters.rollNumber).trim();
      if (filters.outlook)    base.outlookEmail = { $regex: escapeRegex(filters.outlook), $options: 'i' };

      if (filters.phone) {
        const v = String(filters.phone).trim();
        and.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$phoneNumber" },
              regex: escapeRegex(v),
              options: "i"
            }
          }
        });
      }

      if (filters.hostel)      base.hostel       = filters.hostel;
      if (filters.room)        base.roomNumber   = filters.room;
      if (filters.destination) base.destination  = filters.destination;
      if (filters.outGate)     base.checkOutGate = filters.outGate;
      if (filters.inGate) {
        base.checkInGate = (filters.inGate === '—') ? { $in: [null, '', undefined] } : filters.inGate;
      }
      if (filters.status === 'Open')   base.isClosed = false;
      if (filters.status === 'Closed') base.isClosed = true;

      // Date ranges use submitted timestamps as-is
      const addRange = (field, from, to) => {
        if (!from && !to) return;
        const r = {};
        if (from) {
          r.$gte = new Date(from);
        }
        if (to) {
          r.$lte = new Date(to);
        }
        base[field] = r;
      };
      addRange('checkOutTime', filters.coFrom, filters.coTo);
      addRange('checkInTime',  filters.ciFrom, filters.ciTo);

      const q = and.length
        ? (Object.keys(base).length ? { $and: [base, ...and] } : { $and: and })
        : base;

      const sort = { updatedAt: -1, createdAt: -1 };

      const docs = await KhokhaEntryModel.find(q)
        .sort(sort)
        .lean()
        .select({
          name: 1, rollNumber: 1, outlookEmail: 1, phoneNumber: 1,
          hostel: 1, roomNumber: 1, destination: 1,
          checkOutTime: 1, checkOutGate: 1,
          checkInTime: 1, checkInGate: 1,
          isClosed: 1, createdAt: 1, updatedAt: 1
        });

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

      if (format === 'xlsx') {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, "Entries");
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', `attachment; filename="khokha-entries-filtered.xlsx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(buf);
      } else {
        const ws = XLSX.utils.json_to_sheet(rows);
        const csv = XLSX.utils.sheet_to_csv(ws);
        res.setHeader('Content-Disposition', `attachment; filename="khokha-entries-filtered.csv"`);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        return res.send(csv);
      }
    }

    // Legacy fallback (old params)
    const {
      dateField = 'createdAt',
      from, to, name, rollNumber, hostel, roomNumber, destination, checkOutGate, checkInGate,
      isClosed
    } = req.body;

    const q = {};

    if (!from || !to) return res.status(400).send('Please provide both "from" and "to" date/time.');
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate) || isNaN(toDate)) return res.status(400).send('Invalid date format.');

    q[dateField] = { $gte: fromDate, $lte: toDate };

    if (name)        q.name = { $regex: name, $options: 'i' };
    if (rollNumber)  q.rollNumber = rollNumber;
    if (hostel)      q.hostel = hostel;
    if (roomNumber)  q.roomNumber = roomNumber;
    if (destination) q.destination = { $regex: destination, $options: 'i' };
    if (checkOutGate) q.checkOutGate = checkOutGate;
    if (checkInGate)  q.checkInGate  = checkInGate;
    if (isClosed === 'true') q.isClosed = true;
    if (isClosed === 'false') q.isClosed = false;

    const docs = await KhokhaEntryModel.find(q).sort('-' + dateField).lean();

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

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, "Entries");
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Disposition', `attachment; filename="khokha-entries.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buf);
    } else {
      const ws = XLSX.utils.json_to_sheet(rows);
      const csv = XLSX.utils.sheet_to_csv(ws);
      res.setHeader('Content-Disposition', `attachment; filename="khokha-entries.csv"`);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      return res.send(csv);
    }
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).send("Export failed.");
  }
});

function buildFilter(body) {
  const {
    dateField = "createdAt",
    from, to, name, rollNumber, hostel, roomNumber, destination, checkOutGate, checkInGate, isClosed,
  } = body || {};

  const q = {};
  if (from || to) {
    // Apply -5h30m when filtering by checkOutTime or checkInTime
    const OFFSET = 330 * 60 * 1000;
    const shiftNeeded = (dateField === 'checkOutTime' || dateField === 'checkInTime');

    const range = {};
    if (from) {
      const d = new Date(from);
      range.$gte = shiftNeeded ? new Date(d.getTime() - OFFSET) : d;
    }
    if (to) {
      const d = new Date(to);
      range.$lte = shiftNeeded ? new Date(d.getTime() - OFFSET) : d;
    }
    q[dateField] = range;
  }
  if (name)         q.name = { $regex: name, $options: "i" };
  if (destination)  q.destination = { $regex: destination, $options: "i" };
  if (rollNumber)   q.rollNumber = rollNumber;
  if (roomNumber)   q.roomNumber = roomNumber;
  if (hostel)       q.hostel = hostel;
  if (checkOutGate) q.checkOutGate = checkOutGate;
  if (checkInGate)  q.checkInGate  = checkInGate;
  if (isClosed === "true")  q.isClosed = true;
  if (isClosed === "false") q.isClosed = false;

  return { q, dateField };
}

khokhaEntryRouter.post("/entries/export/preview", async (req, res) => {
  try {
    const { q, dateField } = buildFilter(req.body);
    const page  = Math.max(parseInt(req.body.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.body.limit || "25", 10), 1), 200);
    const skip  = (page - 1) * limit;

    const [total, results] = await Promise.all([
      KhokhaEntryModel.countDocuments(q),
      KhokhaEntryModel.find(q)
        .sort({ [dateField]: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .select({
          name: 1, rollNumber: 1, outlookEmail: 1, phoneNumber: 1,
          hostel: 1, roomNumber: 1, destination: 1,
          checkOutTime: 1, checkOutGate: 1,
          checkInTime: 1, checkInGate: 1,
          isClosed: 1, createdAt: 1,
        }),
    ]);

    res.json({ total, page, limit, results });
  } catch (err) {
    console.error("Preview error:", err);
    res.status(500).json({ error: "Failed to preview entries" });
  }
});

export default khokhaEntryRouter;
