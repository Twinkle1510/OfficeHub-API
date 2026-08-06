const express = require('express');
const router = express.Router();
const { 
  applyLeave, getMyLeaveRequests, 
  getAllLeaveRequests, updateLeaveStatus 
} = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyLeave);
router.get('/my-requests', protect, getMyLeaveRequests);
router.get('/all', protect, admin, getAllLeaveRequests);
router.put('/:id/status', protect, admin, updateLeaveStatus);

module.exports = router;
