import mongoose from 'mongoose';

const applianceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Appliance name is required'],
        trim: true
    },
    state: {
        type: String,
        enum: ['on', 'off'],
        default: 'off'
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: [true, 'Device is required']
    },
    lastStateChange: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const Appliance = mongoose.model('Appliance', applianceSchema);