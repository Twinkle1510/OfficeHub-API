const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    default: 'Development'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  stage: {
    type: String,
    enum: ['backlog', 'in-progress', 'code-review', 'completed'],
    default: 'backlog'
  },
  dueDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
