import { User } from '../models/user.model.js';
import { Room } from '../models/room.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { generateInviteCode } from '../utils/generateInviteCode.js';

export const registerAdmin = async (req, res) => {
  const { email, password, securityQuestion, securityAnswer } = req.body;

  if (!email || !password || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ message: 'All fields are required', success: false });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already exists', success: false });

  const hashedPassword = await bcrypt.hash(password, 10);
  const lowerCaseSecurityAnswer = securityAnswer.toLowerCase();
  const hashedAnswer = await bcrypt.hash(lowerCaseSecurityAnswer, 10);
  const username = `user_${Math.random().toString(36).substr(2, 6)}`;

  const newUser = await User.create({
    email,
    password: hashedPassword,
    username,
    role: 'admin',
    securityQuestion,
    securityAnswer: hashedAnswer,
  });

  const room = await Room.create({
    admin: newUser._id,
    inviteCode: generateInviteCode(),
    inviteCodeExpiry: new Date(Date.now() + 1 * 60 * 1000)
  });


  newUser.room = room._id;
  await newUser.save();

  res.status(201).json({ user: newUser, token: generateToken(newUser._id), message: 'Admin registered successfully', success: true });
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found', success: false });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials', success: false });

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.', success: false });
  }
  res.cookie('token', generateToken(user._id), {
    httpOnly: true, secure: true, maxAge: 86400000,
    sameSite: 'Strict'
  });





  //console.log(user);
  res.json({ user, token: generateToken(user._id), success: true, message: 'Admin Logged in successfully' });
};

export const loginMember = async (req, res) => {
  const { email, password, roomId } = req.body;

  const user = await User.findOne({ email, room: roomId });
  if (!user) return res.status(404).json({ message: 'User not found', success: false });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials', success: false });

  res.cookie('token', generateToken(user._id), {
    httpOnly: true, secure: true, maxAge: 86400000,
    sameSite: 'Strict'
  });

  res.json({ user, token: generateToken(user._id), success: true, message: 'Member Logged in successfully' });
};

export const logout = (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 0 // Immediately expire the cookie
    });

    res.json({
      message: 'Logged out successfully.',
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message, success: false });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    res.json({ user, success: true, message: 'User details fetched successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please Try again...', success: false, error: error.message });
  }
};

export const getAllUserCountFromRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    const room = await Room.findById(roomId).populate('admin members');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const totalUsersLength = room.admin.length + room.members.length;


    res.status(200).json({ totalUsersLength });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUserbyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne(email).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    res.json({ user, success: true });



  }
  catch (error) {
    res.status(500).json({ message: 'Server error. Please Try again...', success: false, error: error.message });
  }
};

export const forgotUsername = async (req, res) => {
  const { email, role, securityQuestion, securityAnswer } = req.body;

  if (!email || !role || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ 
      message: 'Email, role, security question, and answer are required.', 
      success: false 
    });
  }

  try {
    const user = await User.findOne({ email, role, securityQuestion });

    if (!user) {
      return res.status(404).json({ 
        message: 'No user found with the provided email, role, and security question.', 
        success: false 
      });
    }

    const lowerCaseSecurityAnswer = securityAnswer.toLowerCase();

    const isAnswerValid = await bcrypt.compare(lowerCaseSecurityAnswer, user.securityAnswer);

    if (!isAnswerValid) {
      return res.status(401).json({ 
        message: 'Incorrect security answer.', 
        success: false 
      });
    }

    return res.status(200).json({ 
      username: user.username, 
      success: true, 
      message: 'Username retrieved successfully.' 
    });
  } catch (error) {
    console.error('Error retrieving username:', error);
    return res.status(500).json({ 
      message: 'An error occurred while retrieving the username.', 
      success: false 
    });
  }
};