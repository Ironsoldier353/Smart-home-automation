import { Device } from "../models/devices.model.js";
import { Room } from "../models/room.model.js";


export const registerDevice = async (req, res) => {
  const { name, macAddress, ssid, password } = req.body;
  const { roomId } = req.params;

  // Validate required fields
  if (!name || !macAddress || !ssid || !password) {
    return res.status(400).json({ message: "All fields (name, macAddress, ssid, password) are required." });
  }

  if (!roomId) {
    return res.status(400).json({ message: "Room ID is required." });
  }

  try {
    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Count devices with the same MAC address in the same room
    const deviceCount = await Device.countDocuments({ macAddress, room: roomId });
    if (deviceCount >= 4) {
      return res.status(400).json({
        message: "A maximum of 4 devices with the same MAC address are allowed in a room.",
      });
    }

    // Create a new device
    const newDevice = new Device({
      name,
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
    });
  } catch (err) {
    console.error("Error registering device:", err);
    res.status(500).json({
      message: "Error saving device to the database.",
      error: err.message,
    });
  }
};


export const getDevicesByRoom = async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        return res.status(400).json({ message: "Room ID is required" });
    }

    try {
        
        const room = await Room.findById(roomId).populate('devices');

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.devices.length === 0) {
            return res.status(404).json({ message: "No devices found in this room" });
        }

        res.status(200).json({ devices: room.devices });
    } catch (err) {
        res.status(500).json({ message: "Error fetching devices", error: err.message });
    }
};

export const renameDevice = async (req, res) => {
    const { roomId, deviceId } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ message: "New name is required" });
    }

    if (!roomId || !deviceId) {
        return res.status(400).json({ message: "Room ID and Device ID are required" });
    }

    try {
        // Check if the room exists
        const room = await Room.findById(roomId).populate('devices');
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        
        const device = room.devices.find(device => device._id.toString() === deviceId);
        if (!device) {
            return res.status(404).json({ message: "Device not found in this room" });
        }

        device.name = newName;
        await device.save();

        await room.save();

        res.status(200).json({
            message: "Device name updated successfully",
            device,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error updating device name",
            error: err.message,
        });
    }
};

export const changeDeviceStatus = async (req, res) => {
    const { roomId, deviceId } = req.params;

    if (!roomId || !deviceId) {
        return res.status(400).json({ message: "Room ID and Device ID are required..." });
    }

    try {
    
        const room = await Room.findById(roomId).populate('devices');
        if (!room) {
            return res.status(404).json({ message: "Room not found. please try again with different credentials..." });
        }

        
        const device = room.devices.find(device => device._id.toString() === deviceId);
        if (!device) {
            return res.status(404).json({ message: "Device not found in this room..." });
        }

        const newStatus = device.status === 'on' ? 'off' : 'on';

        device.status = newStatus;
        await device.save();

        await room.save();
        res.status(200).json({
            message: `Device status toggled successfully to '${newStatus}'`,
            device,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error toggling device status",
            error: err.message,
        });
    }
};

