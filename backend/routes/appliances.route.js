import express from 'express';
import {
    getAllAppliances,
    getAppliancesByDeviceId,
    getAppliancesByRoomId,
    updateApplianceState,
    renameAppliance,
    deleteAppliance
} from '../controllers/appliances.controller.js';

const router = express.Router();

// Get all appliances
router.get('/', getAllAppliances);

// Get appliances by device ID
router.get('/device/:deviceId', getAppliancesByDeviceId);

// Get appliances by room ID
router.get('/room/:roomId', getAppliancesByRoomId);

// Update appliance state (on/off)
router.patch('/:id/state', updateApplianceState);

// Rename an appliance
router.patch('/:id/rename', renameAppliance);

// Delete an appliance
router.delete('/:id', deleteAppliance);

export default router;