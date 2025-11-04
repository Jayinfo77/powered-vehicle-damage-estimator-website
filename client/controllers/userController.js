import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the email is changing and already exists
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
    user.email = req.body.email;
  }

  // Update name if provided
  if (req.body.name) {
    user.name = req.body.name;
  }

  // Update profile image if uploaded
  if (req.file) {
    user.profileImage = req.file.filename;
  }

  // Update password if provided (mongoose will hash it)
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
       profileImage: user.profileImage,
  });
});

// @desc Change user password
// @route PUT /api/users/change-password
// @access Private
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide old and new password');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Old password is incorrect');
  }

  user.password = newPassword; // plain text; will be hashed by mongoose
  await user.save();

  res.json({ message: 'Password updated successfully' });
});
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.status(200).json({ message: 'User account deleted successfully' });
});