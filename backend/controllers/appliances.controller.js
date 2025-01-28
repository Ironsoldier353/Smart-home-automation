import { Appliance } from '../models/appliances.model.js';
import { Device } from '../models/devices.model.js'; 

// Get all appliances
export const getAllAppliances = async (req, res) => {
    try {
        const appliances = await Appliance.find().populate('device');
        res.status(200).json(appliances);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appliances', error });
    }
};

// Get appliances by device ID
export const getAppliancesByDeviceId = async (req, res) => {
    try {
        const { deviceId } = req.params;

        // Validate device existence
        const deviceExists = await Device.findById(deviceId);
        if (!deviceExists) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Fetch appliances associated with the device
        const appliances = await Appliance.find({ device: deviceId });
        if (!appliances.length) {
            // If no appliances, create 4 default appliances for the device
            const defaultAppliances = [
                { name: 'Appliance 1', state: 'off', device: deviceId },
                { name: 'Appliance 2', state: 'off', device: deviceId },
                { name: 'Appliance 3', state: 'off', device: deviceId },
                { name: 'Appliance 4', state: 'off', device: deviceId },
            ];

            await Appliance.insertMany(defaultAppliances);

            const createdAppliances = await Appliance.find({ device: deviceId });
            return res.status(200).json(createdAppliances);
        }

        res.status(200).json(appliances);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appliances by device ID', error });
    }
};

// Update an appliance's state
export const updateApplianceState = async (req, res) => {
    try {
        const { id } = req.params;
        const { state } = req.body;

        // Validate state
        if (!['on', 'off'].includes(state)) {
            return res.status(400).json({ message: 'Invalid state. Use "on" or "off".' });
        }

        const appliance = await Appliance.findByIdAndUpdate(
            id,
            { state },
            { new: true }
        ).populate('device');

        if (!appliance) {
            return res.status(404).json({ message: 'Appliance not found' });
        }

        res.status(200).json(appliance);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appliance state', error });
    }
};