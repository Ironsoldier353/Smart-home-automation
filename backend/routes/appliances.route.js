import express, { Router } from 'express';
import {
    getAllAppliances,
    getApplianceById,
    createAppliance,
    updateApplianceState,
    deleteAppliance,
} from '../controllers/appliances.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Routes for appliances
router.get('/',  getAllAppliances); // Get all appliances
router.get('/:id', authMiddleware, getApplianceById); // Get a specific appliance by ID
router.post('/',  createAppliance); // Create a new appliance
router.patch('/state/:id', authMiddleware, updateApplianceState); // Update appliance state
router.delete('/:id', authMiddleware, deleteAppliance); // Delete an appliance

export default router;
