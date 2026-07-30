const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category (e.g., JavaScript Fundamentals)'],
    },
    task: {
      type: String,
      required: [true, 'Please provide a task (e.g., Learn async programming)'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    targetDate: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    links: {
      type: [String],
      default: [],
    },
    subTasks: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
