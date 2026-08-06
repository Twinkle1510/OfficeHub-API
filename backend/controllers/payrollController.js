const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');

// @desc    Generate Payroll for user (HR / Admin)
// @route   POST /api/payroll/generate
// @access  Private/Admin
exports.generatePayroll = async (req, res) => {
  try {
    const { userId, month, baseSalary, bonuses, deductions } = req.body;

    if (!userId || !month || !baseSalary) {
      return res.status(400).json({ success: false, error: 'Please provide User, Month, and Base Salary' });
    }

    // Calculate Overtime Pay from Attendance records of this month
    const attendanceLogs = await Attendance.find({
      user: userId,
      date: { $regex: `^${month}` }
    });

    const totalOvertimeHours = attendanceLogs.reduce((acc, log) => acc + (log.overtimeHours || 0), 0);
    const hourlyRate = (baseSalary / 160); // 160 standard working hours per month
    const overtimePay = parseFloat((totalOvertimeHours * hourlyRate * 1.5).toFixed(2)); // 1.5x Overtime multiplier

    const netSalary = parseFloat((baseSalary + overtimePay + (Number(bonuses) || 0) - (Number(deductions) || 0)).toFixed(2));

    const payroll = await Payroll.create({
      user: userId,
      month,
      baseSalary,
      overtimePay,
      bonuses: bonuses || 0,
      deductions: deductions || 0,
      netSalary,
      status: 'processed',
      paymentDate: new Date()
    });

    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user's payslips
// @route   GET /api/payroll/my-slips
// @access  Private
exports.getMyPayslips = async (req, res) => {
  try {
    const slips = await Payroll.find({ user: req.user.id }).sort({ month: -1 }).lean();
    res.status(200).json({ success: true, data: slips });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all company payrolls (HR / Admin)
// @route   GET /api/payroll/all
// @access  Private/Admin
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate('user', 'name email role').sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
