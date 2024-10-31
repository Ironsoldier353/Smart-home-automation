import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { addMemberToRoom, generateInviteCodeForRoom, getRoomDetails, removeMemberFromRoom } from '../controllers/room.controller.js';


const router = express.Router();


router.post('/admin/:roomId/invite-code', authMiddleware, generateInviteCodeForRoom);
router.post('/member/add', addMemberToRoom);
router.delete('/admin/remove/:roomId', authMiddleware, removeMemberFromRoom);
router.get('/admin/room-details/:roomId', authMiddleware, getRoomDetails);

export default router;
