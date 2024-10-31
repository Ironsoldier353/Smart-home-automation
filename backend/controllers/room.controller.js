import {User} from '../models/user.model.js';
import {Room} from '../models/room.model.js';
import { generateInviteCode } from '../utils/generateInviteCode.js';
import bcrypt from 'bcrypt';


export const generateInviteCodeForRoom = async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findById(roomId);
  
  if (!room) return res.status(404).json({ message: 'Room not found' });
  
  if (String(room.admin) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only ADMIN can access' });
  }

  try {
    const expiryTime = new Date(Date.now() + 1 * 60 * 1000); 
    expiryTime.setMinutes(expiryTime.getMinutes() + 330);
    const inviteCode = generateInviteCode();
    room.inviteCode = inviteCode;
    room.inviteCodeExpiry = expiryTime;
    
    await room.save();
    res.json({ inviteCode });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Failed to generate unique invite code. Please try again.' 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addMemberToRoom = async (req, res) => {
  const { email, password, inviteCode } = req.body;

  const room = await Room.findOne({ inviteCode });
  if (!room) return res.status(400).json({ message: 'Invalid invite code' });

  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + 330);

  if (!room.inviteCodeExpiry || room.inviteCodeExpiry < currentTime) {
    return res.status(400).json({
      message: 'Invite code has expired. Collect a new invite code from admin',
    });
  }

  const username = email.split('@')[0];
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    role: 'member',
    room: room._id,
    username,
  });

  room.members.push(newUser._id);
  await room.save();

  res.status(201).json({
    user: newUser,
    message: `Member added to Room-${room._id} successfully`,
  });
};




export const removeMemberFromRoom = async (req, res) => {
  const { memberId } = req.body;
  const { roomId } = req.params;

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (String(room.admin) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only Admin can access' });
  }

  room.members = room.members.filter(member => String(member) !== memberId);
  await room.save();

  await User.findByIdAndDelete(memberId);

  res.json({ message: 'Member removed successfully' });
};

export const getRoomDetails = async (req, res) => {
  const { roomId } = req.params;

 
  const room = await Room.findById(roomId).populate('members', 'email');
  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (String(room.admin) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only Admin can access' });
  }

  res.json({ room });
};
