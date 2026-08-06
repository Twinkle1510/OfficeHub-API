const express = require('express');
const router = express.Router();
const { getAssets, createAsset, assignAsset } = require('../controllers/assetController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getAssets);
router.post('/', protect, admin, createAsset);
router.put('/:id/assign', protect, admin, assignAsset);

module.exports = router;
