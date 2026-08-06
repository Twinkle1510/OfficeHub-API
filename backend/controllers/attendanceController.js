const Attendance = require('../models/Attendance');

// Helper to get today's YYYY-MM-DD
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// @desc    Punch In for today
// @route   POST /api/attendance/punch-in
// @access  Private
exports.punchIn = async (req, res) => {
  try {
    const today = getTodayString();
    
    // Check if already punched in today
    let record = await Attendance.findOne({ user: req.user.id, date: today });
    if (record && record.status === 'punched-in') {
      return res.status(400).json({ success: false, error: 'Already punched in for today' });
    }

    record = await Attendance.create({
      user: req.user.id,
      date: today,
      punchIn: new Date(),
      status: 'punched-in'
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Punch Out for today
// @route   POST /api/attendance/punch-out
// @access  Private
exports.punchOut = async (req, res) => {
  try {
    const today = getTodayString();
    const record = await Attendance.findOne({ user: req.user.id, date: today, status: 'punched-in' });

    if (!record) {
      return res.status(404).json({ success: false, error: 'No active Punch In session found for today' });
    }

    const punchOutTime = new Date();
    const diffMs = punchOutTime - new Date(record.punchIn);
    const totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    const extraHours = parseFloat(Math.max(0, totalHours - 8).toFixed(2)); // Standard 8h shift

    record.punchOut = punchOutTime;
    record.workHours = totalHours;
    record.overtimeHours = extraHours;
    record.status = 'completed';

    await record.save();

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get today's punch status
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = getTodayString();
    const record = await Attendance.findOne({ user: req.user.id, date: today });
    res.status(200).json({ success: true, data: record || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get employee attendance logs
// @route   GET /api/attendance/my-logs
// @access  Private
exports.getMyAttendanceLogs = async (req, res) => {
  try {
    const logs = await Attendance.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(30);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all attendance logs (HR / Admin only)
// @route   GET /api/attendance/all
// @access  Private/Admin
exports.getAllAttendanceLogs = async (req, res) => {
  try {
    const logs = await Attendance.find().populate('user', 'name email role').sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
