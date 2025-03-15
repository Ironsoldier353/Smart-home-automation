import mongoose, { Schema } from "mongoose";

const DeviceSchema = new Schema({
    macAddress: {
        type: String,
        required: true,
        unique: true
    },
    ssid: String,
    password: String,
    name: String,
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    status: {
        type: String,
        enum: ['on', 'off', 'pending'],
        default: 'off'
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    lastConfirmed: {
        type: Date
    },
    lastUpdated: {
        type: Date
    },
    appliences: [{
        type: Schema.Types.ObjectId,
        ref: 'Appliance'
    }]
}, { timestamps: true });

export const Device = mongoose.model('Device', DeviceSchema);