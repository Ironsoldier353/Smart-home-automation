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
        enum: ['on', 'off'],
        default: 'off'
    },

    appliences: [{
        type: Schema.Types.ObjectId,
        ref: 'Appliance'
    }]
});

export const Device = mongoose.model('Device', DeviceSchema);