const express = require('express');
const router = express.Router();
const { getActivities, likeActivity, commentActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getActivities); // require login to see the feed
router.put('/:id/like', protect, likeActivity);
router.post('/:id/comment', protect, commentActivity);

module.exports = router;
