const express = require('express');
const { register, login, getProfile } = require('../controllers/auth.Controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { registerValidationSchema, loginValidationSchema } = require('../validations/userValidation');

const router = express.Router();

router.post('/register', validate(registerValidationSchema), register);
router.post('/login', validate(loginValidationSchema), login);
router.get('/profile', protect, getProfile);


module.exports = router;