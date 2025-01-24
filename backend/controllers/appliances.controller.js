import { Appliance } from '../models/appliances.model.js';
import { Device } from '../models/devices.model.js'; // Assuming a `devices.model.js` exists

// Get all appliances
export const getAllAppliances = async (req, res) => {
    try {
        const appliances = await Appliance.find().populate('device');
        res.status(200).json(appliances);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appliances', error });
    }
};

// Get a single appliance by ID
export const getApplianceById = async (req, res) => {
    try {
        const { id } = req.params;
        const appliance = await Appliance.findById(id).populate('device');
        if (!appliance) {
            return res.status(404).json({ message: 'Appliance not found' });
        }
        res.status(200).json(appliance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appliance', error });
    }
};

// Create a new appliance
export const createAppliance = async (req, res) => {
    try {
        const { device, state } = req.body;

        // Validate device existence
        const deviceExists = await Device.findById(device);
        if (!deviceExists) {
            return res.status(400).json({ message: 'Invalid device ID' });
        }

        const appliance = new Appliance({ device, state });
        await appliance.save();
        res.status(201).json(appliance);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appliance', error });
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

// Delete an appliance
export const deleteAppliance = async (req, res) => {
    try {
        const { id } = req.params;
        const appliance = await Appliance.findByIdAndDelete(id);
        if (!appliance) {
            return res.status(404).json({ message: 'Appliance not found' });
        }
        res.status(200).json({ message: 'Appliance deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting appliance', error });
    }
};
