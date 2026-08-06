const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String, // e.g. "2026-08"
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  overtimePay: {
    type: Number,
    default: 0
  },
  bonuses: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'paid'],
    default: 'processed'
  },
  paymentDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);
