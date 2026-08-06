const express = require('express');
const router = express.Router();
const { 
  punchIn, punchOut, getTodayAttendance, 
  getMyAttendanceLogs, getAllAttendanceLogs 
} = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/punch-in', protect, punchIn);
router.post('/punch-out', protect, punchOut);
router.get('/today', protect, getTodayAttendance);
router.get('/my-logs', protect, getMyAttendanceLogs);
router.get('/all', protect, admin, getAllAttendanceLogs);

module.exports = router;
