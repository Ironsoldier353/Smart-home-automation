import express, { Router } from 'express';
import { changeDeviceStatus, getDeviceControl, getDevicesByRoom, registerDevice, renameDevice, updateDeviceControl, validateDevices } from '../controllers/device.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/register/:roomId',authMiddleware, registerDevice); 

router.get('/get/:roomId', authMiddleware, getDevicesByRoom);

router.patch('/rename/:roomId/:deviceId', authMiddleware, renameDevice);

router.patch('/sttus/:roomId/:deviceId', authMiddleware, changeDeviceStatus);

router.post('/validatedevice', validateDevices);

//this 2 are for esp 32
router.get('/control', getDeviceControl);
router.post('/control', updateDeviceControl);


export default router;