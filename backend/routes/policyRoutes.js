const express = require('express');
const router = express.Router();
const { getPolicies, addPolicy } = require('../controllers/policyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getPolicies);
router.post('/', protect, admin, addPolicy);

module.exports = router;
