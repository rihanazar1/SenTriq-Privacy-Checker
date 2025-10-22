const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const { generateToken, generateRefreshToken } = require('../utils/jwt');




const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});




const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an email and password'
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});




const getProfile = asyncHandler(async (req, res) => {
  // Check if user is authenticated (token provided and valid)
  if (req.user) {
    // User is authenticated - return full profile
    return res.status(200).json({
      success: true,
      authenticated: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
      }
    });
  } else {
    // User is not authenticated - return public message
    return res.status(200).json({
      success: true,
      authenticated: false,
      message: 'Please login to view your profile',
      data: null
    });
  }
});




const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  // Check if email is being changed and if it already exists
  if (email && email !== req.user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...(name && { name }),
      ...(email && { email })
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }
  });
});




const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  // Get user with password
  const user = await User.findById(userId).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});





const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Delete user's apps first
  const App = require('../models/appSchema');
  await App.deleteMany({ userId });

  // Delete user account
  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});



const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user statistics using aggregation pipeline
  const userStats = await User.getUserDashboardStats(userId);

  res.status(200).json({
    success: true,
    data: userStats
  });
});



const refreshToken = asyncHandler(async (req, res) => {
  // User is already authenticated via middleware
  const user = req.user;

  // Generate new token
  const newToken = generateRefreshToken(user);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    token: newToken,
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

module.exports = { register, login, getProfile, updateProfile, changePassword, deleteAccount, getDashboard, refreshToken };