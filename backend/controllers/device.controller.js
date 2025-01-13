import { Device } from "../models/devices.model.js";
import { Room } from "../models/room.model.js";
import axios from "axios";


export const registerDevice = async (req, res) => {
    const { newDevice } = req.body;
    if (!newDevice) {
        return res.status(400).json({ message: "newDevice object is required.", success: false });
    }

    const { deviceName, macAddress, ssid, password } = newDevice;

    const roomId = req.roomId;


    // Validate required fields
    if (!deviceName || !macAddress || !ssid || !password) {
        return res.status(400).json({ message: "All fields (name, macAddress, ssid, password) are required.", success: false });
    }

    if (!roomId) {
        return res.status(400).json({ message: "Room ID is required.", success: false });
    }

    try {
        // Check if the room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found.", success: false });
        }

        // Check if the device already exists
        const existingDevice = await Device.findOne({ macAddress });
        if (existingDevice) {
            return res.status(409).json({ message: "Device already exists. Please Give another proper MAC Address...", success: false });
        }

        const validationResponse = await axios.post('http://localhost:8000/api/v1/devices/validateDevice', { macAddress });


        if (!validationResponse.data.success) {
            return res.status(400).json({ message: "MAC address mismatch. Please try again.", success: false });
        }

        // Create a new device
        const newDevice = new Device({
            name: deviceName,
            macAddress,
            ssid,
            password,
            room: roomId,
            status: "off",
        });

        // Save the new device
        await newDevice.save();

        // Update the room's devices list
        room.devices.push(newDevice._id);
        await room.save();

        // Respond with success
        res.status(201).json({
            message: "Device registered successfully.",
            device: newDevice,
            success: true,
        });
    } catch (err) {
        console.error("Error while registering device:", err);
        res.status(500).json({
            message: "Error saving device to the database.",
            error: err.message,
            success: false,
        });
    }
};

//api endpoint for esp to validate the mac and sending the ssid and password
export const validateDevices = async (req, res) => {
    //this mac add comes from esp
    const { macAddress } = req.body;

    if (!macAddress) {
        return res.status(400).json({ message: "MAC address is required.", success: false });
    }

    try {
        // Find the device by MAC address
        const device = await Device.findOne({ macAddress });

        if (!device) {
            // MAC address not found, log error and delete entry
            await Device.deleteOne({ macAddress }); // Delete the device entry with the mismatched MAC address
            return res.status(400).json({
                message: "MAC address mismatch from the ESP's Mac Address. Device entry removed.",
                success: false,
            });
        }

        // Send the SSID and password back to the ESP if MAC address is found
        res.status(200).json({
            ssid: device.ssid,
            password: device.password,
            success: true,
        });
    } catch (err) {
        console.error("Error validating device:", err);
        res.status(500).json({ message: "Internal server error.", success: false });
    }
};



export const getDevicesByRoom = async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        return res.status(400).json({ message: "Room ID is required", success: false });
    }

    try {

        const room = await Room.findById(roomId).populate('devices');

        if (!room) {
            return res.status(404).json({ message: "Room not found", success: false });
        }

        if (room.devices.length === 0) {
            return res.status(404).json({ message: "No devices found in this room", success: false });
        }

        res.status(200).json({ devices: room.devices, success: true });
    } catch (err) {
        res.status(500).json({ message: "Error while fetching devices", error: err.message, success: false });
    }
};


export const renameDevice = async (req, res) => {
    const { roomId, deviceId } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ message: "New name is required", success: false });
    }

    if (!roomId || !deviceId) {
        return res.status(400).json({ message: "Room ID and Device ID are required", success: false });
    }

    try {
        // Check if the room exists
        const room = await Room.findById(roomId).populate('devices');
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }


        const device = room.devices.find(device => device._id.toString() === deviceId);
        if (!device) {
            return res.status(404).json({ message: "Device not found in this room", success: false });
        }

        device.name = newName;
        await device.save();

        await room.save();

        res.status(200).json({
            message: "Device name updated successfully",
            device,
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error updating device name",
            error: err.message,
            success: false,
        });
    }
};

export const changeDeviceStatus = async (req, res) => {
    const { roomId, deviceId } = req.params;

    if (!roomId || !deviceId) {
        return res.status(400).json({ message: "Room ID and Device ID are required...", success: false });
    }

    try {

        const room = await Room.findById(roomId).populate('devices');
        if (!room) {
            return res.status(404).json({
                message: "Room not found. please try again with different credentials...",
                success: false
            });
        }


        const device = room.devices.find(device => device._id.toString() === deviceId);
        if (!device) {
            return res.status(404).json({
                message: "Device not found in this room...",
                success: false
            });
        }

        const newStatus = device.status === 'on' ? 'off' : 'on';

        device.status = newStatus;
        await device.save();

        await room.save();
        res.status(200).json({
            message: `Device status toggled successfully to '${newStatus}'`,
            device,
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error toggling device status",
            error: err.message,
            success: false,
        });
    }
};


