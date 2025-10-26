const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount, 
  getDashboard,
  refreshToken 
} = require('../controllers/auth.Controller');
const { protect } = require('../middleware/auth');
// const { optionalAuth } = require('../middleware/optionalAuth');
const validate = require('../middleware/validation');
const { 
  registerValidationSchema, 
  loginValidationSchema, 
  updateValidationSchema, 
  changePasswordSchema 
} = require('../validations/userValidation');

const router = express.Router();

// Public routes
router.post('/register', validate(registerValidationSchema), register);
router.post('/login', validate(loginValidationSchema), login);

// Dynamic profile route - works with or without authentication
router.get('/profile', protect, getProfile);

// Protected routes
router.put('/update-profile', protect, validate(updateValidationSchema), updateProfile);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);
router.delete('/delete-profile', protect, deleteAccount);
router.get('/dashboard', protect, getDashboard);
router.post('/refresh-token', protect, refreshToken);

// Keep the old /me route for backward compatibility (protected)
router.get('/me', protect, getProfile);

module.exports = router;