const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  punchIn: {
    type: Date,
    required: true
  },
  punchOut: {
    type: Date
  },
  workHours: {
    type: Number,
    default: 0 // Hours worked (e.g. 8.5)
  },
  overtimeHours: {
    type: Number,
    default: 0 // Hours worked exceeding 8 hours
  },
  status: {
    type: String,
    enum: ['punched-in', 'completed'],
    default: 'punched-in'
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
