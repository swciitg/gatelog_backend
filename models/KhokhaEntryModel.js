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
    checkOutTime: {
        type: Date,
        required: [true, 'Check-Out Time is a required field'],
    },
    checkOutGate: {
        type: String,
        required: [true, 'Exit Gate is a required field'],
        // enum: [ "Main_Gate", "KV_Gate", "Khoka_Gate"]
    },
    checkInTime: {
        type: Date,
        default: null,
        required: false
    },
    checkInGate: {
        type: String,
        default: null,
        required: false,
        // enum: [ "Main_Gate", "KV_Gate", "Khoka_Gate","AUTO_CLOSED"]
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
export default KhokhaEntryModel;
