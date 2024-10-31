import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; 

    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); 
    next(); 
  } catch (error) {
    res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};
