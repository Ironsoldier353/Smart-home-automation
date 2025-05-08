import { Appliance } from '../models/appliances.model.js';
import { Device } from '../models/devices.model.js';
import { Room } from '../models/room.model.js';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create default appliances for a device
export const createDefaultAppliances = async (deviceId) => {
    try {
        // Validate device existence before creating appliances
        const device = await Device.findById(deviceId);
        if (!device) {
            throw new Error(`Device with ID ${deviceId} not found`);
        }

        const defaultAppliances = [
            { name: 'Appliance 1', state: 'off', device: deviceId },
            { name: 'Appliance 2', state: 'off', device: deviceId },
            { name: 'Appliance 3', state: 'off', device: deviceId },
            { name: 'Appliance 4', state: 'off', device: deviceId },
        ];

        const createdAppliances = await Appliance.insertMany(defaultAppliances);
        
        // Update the device's appliances array with the newly created appliances
        await Device.findByIdAndUpdate(
            deviceId,
            { $push: { appliances: { $each: createdAppliances.map(app => app._id) } } }
        );
        
        return createdAppliances;
    } catch (error) {
        console.error('Error creating default appliances:', error);
        throw error;
    }
};

// Get all appliances
export const getAllAppliances = async (req, res) => {
    try {
        const appliances = await Appliance.find()
            .populate({
                path: 'device',
                select: 'name macAddress status room'
            });
        res.status(200).json({ appliances, success: true });
    } catch (error) {
        console.error('Error in getAllAppliances:', error);
        res.status(500).json({ 
            message: 'Error fetching appliances', 
            error: error.message, 
            success: false 
        });
    }
};

// Get appliances by device ID
export const getAppliancesByDeviceId = async (req, res) => {
    try {
        const { deviceId } = req.params;
        
        // Validate ObjectId format
        if (!isValidObjectId(deviceId)) {
            return res.status(400).json({
                message: 'Invalid device ID format',
                success: false
            });
        }

        console.log(`Searching for device with ID: ${deviceId}`);
        
        // Validate device existence
        const deviceExists = await Device.findById(deviceId);
        console.log('Device search result:', deviceExists);
        
        if (!deviceExists) {
            return res.status(404).json({ 
                message: 'Device not found',
                deviceId,
                success: false 
            });
        }

        // Fetch appliances associated with the device
        const appliances = await Appliance.find({ device: deviceId });
        
        if (!appliances.length) {
            // If no appliances, create 4 default appliances for the device
            try {
                const createdAppliances = await createDefaultAppliances(deviceId);
                return res.status(200).json({ 
                    message: 'Default appliances created successfully',
                    appliances: createdAppliances,
                    success: true 
                });
            } catch (error) {
                console.error('Error creating default appliances:', error);
                return res.status(500).json({ 
                    message: 'Error creating default appliances', 
                    error: error.message,
                    success: false 
                });
            }
        }

        res.status(200).json({ appliances, success: true });
    } catch (error) {
        console.error('Error in getAppliancesByDeviceId:', error);
        res.status(500).json({ 
            message: 'Error fetching appliances by device ID', 
            error: error.message,
            success: false 
        });
    }
};

// Get appliances by room ID
export const getAppliancesByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;
        
        // Validate ObjectId format
        if (!isValidObjectId(roomId)) {
            return res.status(400).json({
                message: 'Invalid room ID format',
                success: false
            });
        }

        console.log(`Searching for room with ID: ${roomId}`);
        
        // Validate room existence
        const room = await Room.findById(roomId);
        console.log('Room search result:', room);
        
        if (!room) {
            return res.status(404).json({ 
                message: 'Room not found',
                roomId,
                success: false 
            });
        }

        // Fetch devices directly from the room's devices array
        const deviceIds = room.devices;
        console.log('Devices in room:', deviceIds);
        
        if (deviceIds.length === 0) {
            return res.status(200).json({
                message: 'No devices found in this room',
                appliances: [],
                success: true
            });
        }
        
        // Fetch all appliances for the devices in the room
        const appliances = await Appliance.find({ 
            device: { $in: deviceIds } 
        }).populate({
            path: 'device',
            select: 'name macAddress status'
        });

        res.status(200).json({ appliances, success: true });
    } catch (error) {
        console.error('Error in getAppliancesByRoomId:', error);
        res.status(500).json({ 
            message: 'Error fetching appliances by room ID', 
            error: error.message,
            success: false 
        });
    }
};

// Update an appliance's state
export const updateApplianceState = async (req, res) => {
    try {
        const { id } = req.params;
        const { state } = req.body;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid appliance ID format',
                success: false
            });
        }

        // Validate state
        if (!['on', 'off'].includes(state)) {
            return res.status(400).json({ 
                message: 'Invalid state. Use "on" or "off".',
                success: false 
            });
        }

        const appliance = await Appliance.findById(id);
        if (!appliance) {
            return res.status(404).json({ 
                message: 'Appliance not found',
                id,
                success: false 
            });
        }

        // Check if the associated device exists and is active
        const device = await Device.findById(appliance.device);
        if (!device) {
            return res.status(404).json({
                message: 'Associated device not found',
                deviceId: appliance.device,
                success: false
            });
        }

        // Only allow state changes if device is active
        if (device.status !== 'active' && state === 'on') {
            return res.status(400).json({
                message: 'Cannot turn on appliance when device is not active',
                deviceStatus: device.status,
                success: false
            });
        }

        // Update the appliance state
        appliance.state = state;
        appliance.lastStateChange = Date.now();
        await appliance.save();

        // Populate the device information in the response
        await appliance.populate({
            path: 'device',
            select: 'name status macAddress'
        });

        res.status(200).json({ 
            message: 'Appliance state updated successfully',
            appliance,
            success: true 
        });
    } catch (error) {
        console.error('Error in updateApplianceState:', error);
        res.status(500).json({ 
            message: 'Error updating appliance state', 
            error: error.message,
            success: false 
        });
    }
};

// Rename an appliance
export const renameAppliance = async (req, res) => {
    try {
        const { id } = req.params;
        const { newName } = req.body;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid appliance ID format',
                success: false
            });
        }

        if (!newName || newName.trim() === '') {
            return res.status(400).json({ 
                message: 'New name is required and cannot be empty',
                success: false 
            });
        }

        const appliance = await Appliance.findByIdAndUpdate(
            id,
            { name: newName.trim() },
            { new: true }
        ).populate({
            path: 'device',
            select: 'name status macAddress'
        });

        if (!appliance) {
            return res.status(404).json({ 
                message: 'Appliance not found',
                id,
                success: false 
            });
        }

        res.status(200).json({ 
            message: 'Appliance renamed successfully',
            appliance,
            success: true 
        });
    } catch (error) {
        console.error('Error in renameAppliance:', error);
        res.status(500).json({ 
            message: 'Error renaming appliance', 
            error: error.message,
            success: false 
        });
    }
};

// Delete an appliance
export const deleteAppliance = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid appliance ID format',
                success: false
            });
        }

        const appliance = await Appliance.findById(id);
        if (!appliance) {
            return res.status(404).json({ 
                message: 'Appliance not found',
                id,
                success: false 
            });
        }

        // Remove appliance reference from the associated device
        await Device.findByIdAndUpdate(
            appliance.device,
            { $pull: { appliances: id } }
        );

        // Delete the appliance
        await Appliance.findByIdAndDelete(id);

        res.status(200).json({ 
            message: 'Appliance deleted successfully',
            id,
            success: true 
        });
    } catch (error) {
        console.error('Error in deleteAppliance:', error);
        res.status(500).json({ 
            message: 'Error deleting appliance', 
            error: error.message,
            success: false 
        });
    }
};

// Hook function to add to validateDevices in devices.controller.js
// This will ensure appliances are created when a device is validated
export const ensureAppliancesExist = async (deviceId) => {
    try {
        // Validate ObjectId format
        if (!isValidObjectId(deviceId)) {
            console.error('Invalid device ID format in ensureAppliancesExist:', deviceId);
            return false;
        }
        
        const existingAppliances = await Appliance.find({ device: deviceId });
        
        if (existingAppliances.length === 0) {
            await createDefaultAppliances(deviceId);
            console.log(`Created default appliances for device: ${deviceId}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error ensuring appliances exist:', error);
        return false;
    }
};