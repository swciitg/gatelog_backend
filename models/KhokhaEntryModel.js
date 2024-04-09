const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Hostels = require('./constants').Hostels;
const Branch = require('./constants').Branch;
const Program = require('./constants').Program;

const khokhaEntrySchema = new Schema({
  outlookEmail: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  outTime: {
    type: Date,
    required: true
  },
  inTime: {
    type: Date,
    default: null,
    required: false
  },
  rollNumber: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  hostel: {
    type: String,
    enum: Object.values(Hostels),
    required:true
  },
  branch: {
    type: String,
    enum: Object.values(Branch),
    required:true
  },
  program: {
    type: String,
    enum: Object.values(Program),
    required:true
  },
  isClosed: {
    type: Boolean,
    default:false,
    required:false
  },
 
}, {
  timestamps: true,
});

const KhokhaEntryModel = mongoose.model('KhokhaEntryModel', khokhaEntrySchema);

module.exports = KhokhaEntryModel;
