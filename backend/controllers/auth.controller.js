import {User} from '../models/user.model.js';
import {Room} from '../models/room.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { generateInviteCode } from '../utils/generateInviteCode.js';

export const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = `user_${Math.random().toString(36).substr(2, 6)}`;

  const newUser = await User.create({
    email,
    password: hashedPassword,
    username,
    role: 'admin',
  });

  const room = await Room.create({ 
    admin: newUser._id, 
    inviteCode: generateInviteCode(), 
    inviteCodeExpiry: new Date(Date.now() + 1 * 60 * 1000) 
  });


  newUser.room = room._id;
  await newUser.save();

  res.status(201).json({ user: newUser, token: generateToken(newUser._id), message: 'Admin registered successfully' });
};


export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  res.cookie('token', generateToken(user._id), { httpOnly: true, secure: true });

  res.json({ user, token: generateToken(user._id) });
};


export const loginMember = async (req, res) => {
  const { email, password, roomId } = req.body;

  const user = await User.findOne({ email, room: roomId });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  res.cookie('token', generateToken(user._id), { httpOnly: true, secure: true });

  res.json({ user, token: generateToken(user._id) });
};


export const logout = (req, res) => {
  res.clearCookie('token'); 
  res.json({ message: 'Logged out successfully' });
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};