const User = require('../models/User');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');
const Project = require('../models/Project');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const isHRorAdmin = ['admin', 'hr', 'owner'].includes(req.user.role);
    
    if (isHRorAdmin) {
      // HR / Admin Metrics
      const totalEmployees = await User.countDocuments();
      const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
      
      const currentMonth = new Date().toISOString().slice(0, 7);
      const payrollsThisMonth = await Payroll.find({ month: currentMonth });
      const totalPayrollExpense = payrollsThisMonth.reduce((sum, p) => sum + p.netSalary, 0);
      
      const activeProjects = await Project.countDocuments({ stage: { $in: ['in-progress', 'code-review'] } });

      return res.status(200).json({
        success: true,
        data: {
          totalEmployees,
          pendingLeaves,
          totalPayrollExpense,
          activeProjects,
          role: req.user.role
        }
      });
    } else {
      // Employee Metrics
      const myPendingLeaves = await Leave.countDocuments({ user: req.user._id, status: 'pending' });
      const myActiveTasks = await Project.countDocuments({ assignedTo: req.user._id, stage: { $in: ['in-progress', 'code-review'] } });
      const myLatestPayroll = await Payroll.findOne({ user: req.user._id }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: {
          myPendingLeaves,
          myActiveTasks,
          lastNetSalary: myLatestPayroll ? myLatestPayroll.netSalary : 0,
          role: req.user.role
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
};
