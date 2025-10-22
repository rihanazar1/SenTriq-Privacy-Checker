const express = require('express');
const {
  createVaultEntry,
  getVaultEntries,
  getDecryptedEntry,
  updateVaultEntry,
  deleteVaultEntry,
  getVaultStats
} = require('../controllers/vault.Controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const validateQuery = require('../middleware/queryValidation');
const { createAppRiskLimiter } = require('../middleware/rateLimiter');
const {
  createVaultSchema,
  updateVaultSchema,
  decryptEntrySchema,
  deleteEntrySchema,
  vaultQuerySchema
} = require('../validations/vaultValidation');

const router = express.Router();

// Apply authentication to all vault routes
router.use(protect);

// Apply rate limiting to sensitive operations
const vaultLimiter = createAppRiskLimiter();

// @route   POST /api/vault
// @desc    Create new vault entry
// @access  Private
router.post('/', 
  vaultLimiter,
  validate(createVaultSchema), 
  createVaultEntry
);

// @route   GET /api/vault
// @desc    Get all vault entries (without sensitive data)
// @access  Private
router.get('/', 
  validateQuery(vaultQuerySchema),
  getVaultEntries
);

// @route   GET /api/vault/stats
// @desc    Get vault statistics
// @access  Private
router.get('/stats', getVaultStats);

// @route   POST /api/vault/:id/decrypt
// @desc    Get single vault entry with decrypted data
// @access  Private
router.post('/:id/decrypt', 
  vaultLimiter,
  validate(decryptEntrySchema), 
  getDecryptedEntry
);

// @route   PUT /api/vault/:id
// @desc    Update vault entry
// @access  Private
router.put('/:id', 
  vaultLimiter,
  validate(updateVaultSchema), 
  updateVaultEntry
);

// @route   DELETE /api/vault/:id
// @desc    Delete vault entry
// @access  Private
router.delete('/:id', 
  vaultLimiter,
  validate(deleteEntrySchema), 
  deleteVaultEntry
);

module.exports = router;