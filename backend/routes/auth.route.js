
import express from 'express';
import { getUserDetails, loginAdmin, loginMember, logout, registerAdmin } from '../controllers/auth.controller.js';
import { authMiddleware} from '../middlewares/auth.js';

const router = express.Router();

router.post('/admin/register', registerAdmin);  
router.post('/admin/login', loginAdmin);         
router.post('/user/logoutUser',authMiddleware, logout);  
router.post('/member/login', loginMember);     
router.post('/:userId',authMiddleware, getUserDetails);       


export default router;
