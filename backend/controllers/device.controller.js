import { Device } from "../models/devices.model.js";
import { Room } from "../models/room.model.js";


export const registerDevice = async (req, res) => {
    const { newDevice } = req.body;
    if (!newDevice) {
        return res.status(400).json({ message: "newDevice object is required.", success: false });
    }

    const { deviceName, macAddress, ssid, password } = newDevice;

    const roomId = req.roomId;
    console.log("req: ", req.user);
    console.log("Room ID: ", roomId);


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



        // Create a new device
        const newDevice = await Device.create({
            name: deviceName,
            macAddress,
            ssid,
            password,
            room: roomId,
            status: "pending",
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
        console.error("Error while registering Your device:", err);
        res.status(500).json({
            message: "Error while registering Your device. ",
            error: err.message,
            success: false,
        });
    }
};

export const validateDevices = async (req, res) => {
  
    const { macAddress } = req.body;

    if (!macAddress) {
        return res.status(400).json({ message: "MAC address is required.", success: false });
    }

    try {
     
        const device = await Device.findOne({ macAddress });

        if (!device) {
            return res.status(400).json({
                message: "MAC address mismatch from the ESP's Mac Address. Device entry removed.",
                success: false,
            });
        }

        if (device.status === "pending") {
            device.status = "active";
            await device.save();
        }

        res.status(200).json({
            ssid: device.ssid,
            password: device.password,
            deviceId: device._id.toString(),
            success: true,
        });
    } catch (err) {
        console.error("Error validating device:", err);
        res.status(500).json({ message: "Internal server error.", success: false });
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

//add the changeDeviceStatus function like if esp is on then do manually off and no /validatedevice it will directly handle appliences. 




