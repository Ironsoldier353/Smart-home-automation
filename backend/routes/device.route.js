import express, { Router } from 'express';
import { changeDeviceStatus, getDevicesByRoom, registerDevice, renameDevice, validateDevices } from '../controllers/device.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/register/:roomId', registerDevice); //Add the authMiddleware here

router.get('/get/:roomId', authMiddleware, getDevicesByRoom);

router.patch('/rename/:roomId/:deviceId', authMiddleware, renameDevice);

router.patch('/sttus/:roomId/:deviceId', authMiddleware, changeDeviceStatus);

router.post('/validatedevice', validateDevices);


export default router;