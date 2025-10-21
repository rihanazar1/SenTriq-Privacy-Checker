const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const { generateToken } = require('../utils/jwt');




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



// @desc    Get user profile (dynamic - works with or without token)
// @route   GET /api/auth/profile
// @access  Public/Private (dynamic)
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


module.exports = {register, login, getProfile};