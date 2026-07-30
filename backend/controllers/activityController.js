const Activity = require('../models/Activity');

// @desc    Get all recent activities (Community Feed)
// @route   GET /api/activities
// @access  Public (or Private if you prefer, going with Public so everyone can see the feed)
exports.getActivities = async (req, res) => {
  try {
    // Get the latest 50 activities, populated with user names
    const activities = await Activity.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
