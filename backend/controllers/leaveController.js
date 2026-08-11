const Leave = require('../models/Leave');
const Notification = require('../models/Notification');

// @desc    Apply for Leave
// @route   POST /api/leave/apply
// @access  Private
exports.applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, error: 'Please provide start date, end date, and reason' });
    }

    const leave = await Leave.create({
      user: req.user.id,
      type: type || 'Casual',
      startDate,
      endDate,
      reason,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user's leave requests
// @route   GET /api/leave/my-requests
// @access  Private
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const requests = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all leave requests (HR / Admin only)
// @route   GET /api/leave/all
// @access  Private/Admin
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const requests = await Leave.find().populate('user', 'name email role').sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Approve or Reject Leave (HR / Admin only)
// @route   PUT /api/leave/:id/status
// @access  Private/Admin
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, hrNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status specified' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }

    leave.status = status;
    if (hrNote) leave.hrNote = hrNote;

    await leave.save();

    await Notification.create({
      user: leave.user,
      title: `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been ${status}. ${hrNote ? 'HR Note: ' + hrNote : ''}`,
      type: 'leave'
    });

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
