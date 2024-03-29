const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    type: Number,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  hostel: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  isClosed: {
    type: Boolean,
    default: false,
    required: false
  }
}, {
  timestamps: true,
});

const KhokhaEntryModel = mongoose.model('KhokhaEntryModel', khokhaEntrySchema);

module.exports = KhokhaEntryModel;