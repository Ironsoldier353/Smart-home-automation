import express, { Router } from 'express';
import { registerDevice, renameDevice, validateDevices } from '../controllers/device.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/register/:roomId',authMiddleware, registerDevice); 


router.patch('/rename/:roomId/:deviceId', authMiddleware, renameDevice);

router.post('/validatedevice', validateDevices);



export default router;