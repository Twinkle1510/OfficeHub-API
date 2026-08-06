const express = require('express');
const router = express.Router();
const { generatePayroll, getMyPayslips, getAllPayrolls } = require('../controllers/payrollController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/generate', protect, admin, generatePayroll);
router.get('/my-slips', protect, getMyPayslips);
router.get('/all', protect, admin, getAllPayrolls);

module.exports = router;
