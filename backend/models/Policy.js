const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'External Link'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Policy', PolicySchema);
