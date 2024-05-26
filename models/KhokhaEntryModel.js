import mongoose from 'mongoose';
import {Hostels} from '../shared/enums.js'

const khokhaEntrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is a required field'],
    },
    rollNumber: {
        type: String,
        required: [true, 'Roll Number is a required field'],
    },
    outlookEmail: {
        type: String,
        required: [true, 'Outlook email is a required field'],
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Phone Number is a required field'],
    },
    // program: {
    //     type: String,
    //     enum: Object.values(Program),
    //     required: [true, 'Program is a required field'],
    // },
    // branch: {
    //     type: String,
    //     enum: Object.values(Branch),
    //     required: [true, 'Branch is a required field'],
    // },
    hostel: {
        type: String,
        enum: Object.values(Hostels),
        required: [true, 'Hostel is a required field'],
    },
    roomNumber: {
        type: String,
        required: [true, 'Room Number is a required field'],
    },
    destination: {
        type: String,
        required: [true, 'Destination is a required field'],
    },
    outTime: {
        type: Date,
        required: [true, 'Check-Out Time is a required field'],
    },
    inTime: {
        type: Date,
        default: null,
        required: false
    },
    exitGate: {
        type: String,
        required: [true, 'Exit Gate is a required field'],
    },
    entryGate: {
        type: String,
        default: null,
        required: false,
    },
    isClosed: {
        type: Boolean,
        default: false,
        required: false
    },
}, {
    timestamps: true,
});


const KhokhaEntryModel = mongoose.model('KhokhaEntryModel', khokhaEntrySchema);
export default KhokhaEntryModel;
