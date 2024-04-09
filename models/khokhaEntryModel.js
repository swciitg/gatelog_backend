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
  outgoingLocation: {
    type: String,
    required: true
  },
  exitTime: {
    type: Date,
    default: new Date,
    required:false
  },
  rollNumber: {
    type: Number, 
    required: true
  },
  entryTime: {
    type: Date,
    default: null,
    required:false
  },
  roomNumber: {
    type: String,
    required:true
  },
  hostel: {
    type: String,
    enum: Object.values(Hostels),
    required:true
  },
  department: {
    type: String,
    enum: Object.values(Branch),
    required:true
  },
  program: {
    type: String,
    enum: Object.values(Program),
    required:true
  },
  status: {
    type: Boolean,
    default:false
  },
  connectionId:{
    type:String,
    required:true
  }
 
}, {
  timestamps: true,
});

const khokhaEntryModel = mongoose.model('KhokhaEntryModel', khokhaEntrySchema);

module.exports = khokhaEntryModel;