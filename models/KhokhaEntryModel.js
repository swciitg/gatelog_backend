// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// const Hostels = require('./enums').Hostels;
import {Hostels,Branch,Program} from './enums.js'
// const Branch = require('./enums').Branch;
// const Program = require('./enums').Program;

const khokhaEntrySchema = new Schema({
  outlookEmail: {
    type: String,
    required: [true,'Outlook email is a required field'],
  },
  name: {
    type: String,
    required: [true,'Name is a required field'],
  },
  phoneNumber: {
    type: Number,
    required: [true,'Phone Number is a required field'],
  },
  destination: {
    type: String,
    required: [true,'Destination is a required field'],
  },
  outTime: {
    type: Date,
    required: [true,'Out time is a required field'],
  },
  inTime: {
    type: Date,
    default: null,
    required: false
  },
  rollNumber: {
    type: String,
    required: [true,'Roll Number is a required field'],
  },
  roomNumber: {
    type: String,
    required: [true,'Room Number is a required field'],
  },
  hostel: {
    type: String,
    enum: Object.values(Hostels),
    required: [true,'Hostel is a required field'],
  },
  branch: {
    type: String,
    enum: Object.values(Branch),
    required: [true,'Branch is a required field'],
  },
  program: {
    type: String,
    enum: Object.values(Program),
    required: [true,'Program is a required field'],
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

export default KhokhaEntryModel;
