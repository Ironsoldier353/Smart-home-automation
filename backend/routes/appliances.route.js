import express from 'express';
import { getAllAppliances, getAppliancesByDeviceId, updateApplianceState } from '../controllers/appliances.controller.js';

const router = express.Router();

// Use consistent base route for appliance endpoints
router.get('/', getAllAppliances);  // Get all appliances
router.get('/device/:deviceId', getAppliancesByDeviceId);  // Get appliances by device ID
router.put('/:id/state', updateApplianceState);  // Update an appliance's state

export default router;