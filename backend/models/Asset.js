const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String, // e.g. "MacBook Pro M2 Max"
    required: true
  },
  category: {
    type: String, // e.g. "Laptop", "Monitor", "Access Key", "Headset"
    required: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Needs Repair'],
    default: 'Excellent'
  },
  status: {
    type: String,
    enum: ['Available', 'Assigned', 'Under Maintenance'],
    default: 'Available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
