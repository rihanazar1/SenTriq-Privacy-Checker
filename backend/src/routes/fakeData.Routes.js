const express = require('express');
const {
  generateFakeData,
  getAvailableFields,
  getSampleData
} = require('../controllers/fakeData.Controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { createGeneralLimiter } = require('../middleware/rateLimiter');
const { generateFakeDataSchema } = require('../validations/fakeDataValidation');

const router = express.Router();

// Apply authentication to all fake data routes
router.use(protect);

// Apply rate limiting
const fakeDataLimiter = createGeneralLimiter();

// @route   POST /api/fake-data/generate
// @desc    Generate fake data based on selected fields
// @access  Private
router.post('/generate', 
  fakeDataLimiter,
  validate(generateFakeDataSchema), 
  generateFakeData
);

// @route   GET /api/fake-data/fields
// @desc    Get available fake data fields
// @access  Private
router.get('/fields', getAvailableFields);

// @route   GET /api/fake-data/sample
// @desc    Generate sample fake data for preview
// @access  Private
router.get('/sample', getSampleData);

module.exports = router;