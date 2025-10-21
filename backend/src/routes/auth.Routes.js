const express = require('express');
const { register, login, getMe } = require('../controllers/auth.Controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const User = require('../models/userSchema');

const router = express.Router();

router.post('/register', validate(User.registerValidationSchema), register);
router.post('/login', validate(User.loginValidationSchema), login);
router.get('/me', protect, getMe);

module.exports = router;