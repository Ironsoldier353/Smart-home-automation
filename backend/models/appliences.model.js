import mongoose, { Schema } from "mongoose";

const ApplianceSchema = new Schema({
    device: {
        type: Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    state: {
        type: String,
        enum: ['on', 'off'],
        default: 'off'
    }
});

export const Appliance = mongoose.model('Appliance', ApplianceSchema);
