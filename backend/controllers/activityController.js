const Activity = require('../models/Activity');

// @desc    Get all recent activities (Community Feed)
// @route   GET /api/activities
// @access  Public (or Private if you prefer, going with Public so everyone can see the feed)
exports.getActivities = async (req, res) => {
  try {
    // Get the latest 50 activities, populated with user names
    const activities = await Activity.find()
      .populate('user', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Like or Unlike an activity
// @route   PUT /api/activities/:id/like
// @access  Private
exports.likeActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, error: 'Activity not found' });

    // Check if the user has already liked the activity
    if (activity.likes.includes(req.user.id)) {
      activity.likes = activity.likes.filter(id => id.toString() !== req.user.id.toString());
    } else {
      activity.likes.push(req.user.id);
    }
    
    await activity.save();
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Comment on an activity
// @route   POST /api/activities/:id/comment
// @access  Private
exports.commentActivity = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'Comment text is required' });

    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, error: 'Activity not found' });

    const newComment = {
      user: req.user.id,
      text
    };

    activity.comments.push(newComment);
    await activity.save();

    // Re-fetch to populate the newly added comment's user
    const updatedActivity = await Activity.findById(req.params.id)
      .populate('user', 'name')
      .populate('comments.user', 'name');

    res.status(200).json({ success: true, data: updatedActivity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
